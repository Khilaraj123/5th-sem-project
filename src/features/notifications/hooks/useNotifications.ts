import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { sendEmailNotification, sendPushNotification, sendInAppNotification } from '../api/notificationsApi';
import { useNotificationStore } from '../store/notificationStore';
import useAuth from '../../auth/hooks/useAuth';
import type { SendEmailInput, SendPushInput, SendInAppInput } from '../types/notification.types';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { user } = useAuth();

  const emailMutation = useMutation<any, Error, SendEmailInput>({
    mutationFn: sendEmailNotification,
  });

  const pushMutation = useMutation<any, Error, SendPushInput>({
    mutationFn: sendPushNotification,
  });

  const inAppMutation = useMutation<any, Error, SendInAppInput>({
    mutationFn: sendInAppNotification,
    onSuccess: (_, variables) => {
      // Simulate real-time receipt locally if sent to current user
      if (user && variables.userId === user.id) {
        addNotification(variables.title, variables.message, 'info', 'in-app');
      }
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    sendEmail: emailMutation.mutateAsync,
    isSendingEmail: emailMutation.isPending,
    emailError: emailMutation.error,

    sendPush: pushMutation.mutateAsync,
    isSendingPush: pushMutation.isPending,
    pushError: pushMutation.error,

    sendInApp: inAppMutation.mutateAsync,
    isSendingInApp: inAppMutation.isPending,
    inAppError: inAppMutation.error,
  };
};

export const useSignalRNotifications = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (connection) {
        connection.stop();
        setConnection(null);
        setIsConnected(false);
      }
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const hubUrl = apiUrl.replace(/\/api$/, '') + '/hubs/notifications';

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('token') || '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    setConnection(newConnection);
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        setIsConnected(true);
        console.log('SignalR Notification Hub connected.');
      } catch (err) {
        console.warn('SignalR connection failed, retrying...', err);
        setIsConnected(false);
      }
    };

    startConnection();

    // Register listeners
    const handleReceive = (payload: any) => {
      console.log('SignalR Notification received:', payload);
      // Payload can be string or object { title, message, type }
      if (typeof payload === 'string') {
        addNotification('Alert', payload, 'info', 'in-app');
      } else if (payload && typeof payload === 'object') {
        const title = payload.title || payload.Title || 'New Notification';
        const message = payload.message || payload.Message || '';
        const type = payload.type || payload.Type || 'info';
        addNotification(title, message, type, 'in-app');
      }
    };

    connection.on('ReceiveNotification', handleReceive);
    connection.on('InAppNotification', handleReceive);
    connection.on('notification', handleReceive);

    return () => {
      connection.off('ReceiveNotification');
      connection.off('InAppNotification');
      connection.off('notification');
      connection.stop().then(() => setIsConnected(false));
    };
  }, [connection, addNotification]);

  return { isConnected };
};

export default useNotifications;
