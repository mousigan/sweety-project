const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white border border-[#E5E5EA] rounded-xl p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
