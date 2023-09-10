import './Select.scss';

interface SelectItem {
  value: any;
  label: any;
}

interface SelectProps {
  value?: any;
  style?: any;
  name?: string;
  id?: string;
  options: SelectItem[];
  onChange?: (type: any) => void;
  className?: any;
  disabled?: boolean;
}
const Select = (props: SelectProps) => {
  const onChange = (val: any) => {
    if (props.onChange) props.onChange(val);
  };
  return (
    <select
      {...props}
      className={[
        'main-select',
        props.disabled ? 'disabled' : '',
        props.className
      ].join(' ')}
      onChange={(e) => onChange(e.target.value)}
    >
      {props.options.map((item, index) => (
        <option key={index} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
