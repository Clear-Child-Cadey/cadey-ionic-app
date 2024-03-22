const presentToast = (
  toastSetter: (options: {
    message: string;
    duration: number;
    position: 'top' | 'middle' | 'bottom';
  }) => void,
  position: 'top' | 'middle' | 'bottom',
  message: string,
  duration: number,
) => {
  toastSetter({
    message,
    duration,
    position,
  });
};

export default presentToast;
