import styles from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
  text: string;
  disabled?: boolean;
};

function Button({ onClick, text, disabled }: ButtonProps) {
  return (
    <button
      className={styles.Button} // Add the className to apply the styles
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;