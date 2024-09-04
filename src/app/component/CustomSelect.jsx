import React from 'react';
import Select from 'react-select';
import { components } from 'react-select';

// Custom Option component to include images
const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center text-black">
        <img
          src={props.data.image}
          alt={props.data.label}
          className="h-6 w-6 mr-2 "
        />
        <span className='px-5'>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

const CustomSelect = () => {
  const options = [
    { value: 'eth', label: 'ETH', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { value: 'btc', label: 'BTC', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { value: 'ltc', label: 'LTC', image: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' },
    // Add more options here
  ];

  return (
    <Select
      options={options}
      defaultValue={CustomSelect[1]}
      components={{ Option: CustomOption }}
      className=" rounded-lg w-20 shadow-md hover:shadow-lg transition-shadow duration-300"
      classNamePrefix="custom-select"
    />
  );
};

export default CustomSelect;
