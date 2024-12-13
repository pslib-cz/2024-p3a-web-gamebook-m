
type AlertProps = {
  message: string;
  type: 'error' | 'success' | 'info' | 'warning';
};

const Alert = ({ message, type }: AlertProps) => {
    return (
      <div className={`alert alert-${type}`} role="alert">
            {message}
        </div>
    );
};

export default Alert;