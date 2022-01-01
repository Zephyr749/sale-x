const DateTime = ({ label, labelColor, className, ...props }) => {
    // integrate formik and yup for frontend validation
    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={label}
            className='font-mont font-medium block text-[12px] lg:text-sm text-custom-primaryColor'
            style={{
              color: labelColor && labelColor,
            }}
          >
            {label}
          </label>
        )}
        <input
          id={label}
          type='datetime-local'
          className={`w-full outline-none px-5 bg-[#F6F7FC] placeholder-[#4A4A4A] h-[46px] mt-2 rounded-[10px] text-[12px] lg:text-sm text-[#000000] font-medium ${className}`}
          {...props}
        />
      </div>
    );
  };
  
  export default DateTime;
  