import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeNotification } from '@/store/slices/uiSlice';
import {
  ToastContainer,
  Toast,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastMessage,
  ToastClose,
  ToastProgress,
} from '@/styles';
import type { Notification } from '@/store/slices/uiSlice';

const ToastItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(100);
  const duration = notification.duration || 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100);
        if (newProgress <= 0) {
          clearInterval(interval);
          dispatch(removeNotification(notification.id));
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [dispatch, duration, notification.id]);

  const icons = {
    success: <CheckCircle />,
    error: <XCircle />,
    warning: <AlertTriangle />,
    info: <Info />,
  };

  return (
    <Toast
      $type={notification.type}
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <ToastIcon className="toast-icon">{icons[notification.type]}</ToastIcon>
      <ToastContent>
        {notification.title && <ToastTitle>{notification.title}</ToastTitle>}
        <ToastMessage>{notification.message}</ToastMessage>
      </ToastContent>
      <ToastClose onClick={() => dispatch(removeNotification(notification.id))}>
        <X size={16} />
      </ToastClose>
      <ToastProgress
        $type={notification.type}
        initial={{ width: '100%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </Toast>
  );
};

const ToastContainerComponent: React.FC = () => {
  const notifications = useAppSelector((state) => state.ui.notifications);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <ToastContainer>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <ToastItem key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </ToastContainer>,
    document.body
  );
};

export default ToastContainerComponent;
