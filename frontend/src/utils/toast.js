import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const commonOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored'
};

export const notifySuccess = (msg) => toast.success(msg, commonOptions);
export const notifyError = (msg) => toast.error(msg, commonOptions);
export const notifyInfo = (msg) => toast.info(msg, commonOptions);
export const notifyWarning = (msg) => toast.warning(msg, commonOptions);