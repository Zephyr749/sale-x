import React, { useState, Fragment } from 'react';
import { primaryColor, accentColor } from '../../styles/variables.module.scss';

import { LOCKED_TOKENS, OWNER_LOCKED_TOKEN } from '../../Utils/data';
import { useAppContext } from '../../contexts/AppContext';
import { lockData } from '../../pages/sale-lock/token_locker';
import { tokenData } from '../../pages/sale-lock/token_locker';
import { lpData } from '../../pages/sale-lock/index';
import { lpLockData } from '../../pages/sale-lock/index';
export const SaleLockTab = ({ activeTab, children, ...props }) => {
  const app = useAppContext();

  return (
    <Fragment>
      <div className='flex justify-between items-center'>
        <div className='bg-[#F6F7FC] py-2 px-2 rounded-[10px] h-[56px] lg:h-[60px] w-full lg:w-[fit-content] flex justify-between items-center overflow-hidden'>
          {children.map((step, i) => (
            <button
              key={i}
              onClick={() => props.handleActiveTab(step.props.title)}
              className={`h-full whitespace-nowrap flex-1 flex justify-center items-center bg-custom-primaryColor rounded-md py-2 px-4 lg:px-6 ${
                activeTab === step.props.title && 'py-2 px-4 lg:px-7'
              }`}
              style={{
                backgroundColor:
                  activeTab === step.props.title ? primaryColor : 'transparent',
              }}
            >
              <h1
                className='font-mont text-[12px] lg:text-sm'
                style={{
                  color:
                    activeTab === step.props.title ? 'white' : primaryColor,
                  fontWeight: activeTab === step.props.title ? 700 : 500,
                }}
              >
                {step.props.title}
              </h1>
            </button>
          ))}
        </div>
        <button className='hidden lg:block rounded-[10px] h-[46px] w-[fit-content] px-4 border border-solid border-custom-accentColor'>
          <h1 className='font-mont font-semibold text-[12px] text-custom-accentColor'>
            Manage Locked Tokens
          </h1>
        </button>
      </div>
      {children.map(one => {
        if (one.props.title == activeTab) {
          return <React.Fragment key={one.props.title}>{one}</React.Fragment>;
        }
      })}
    </Fragment>
  );
};

export const LockedTokenCard = props => {
  const {
    locker,
    releaseTime,
    amount,
    token_percent,
    token,
    handleFirstView,
    index
  } = props;
  let rTime = new Date(releaseTime*1000);
  // console.log(rTime.toDateString());
  let date = rTime.toDateString();
  let time = rTime.toTimeString();
  
  return (
    <div
      onClick={()=>handleFirstView(index)}
      className=' bg-[#FAFBFD] lg:bg-[#F6F7FC0D]  border-[0.1px] lg:border-[0.5px] border-solid border-custom-accentColor rounded-[15px] lg:rounded-[20px] px-5 flex flex-col items-center text-center'
    >
      <div className='w-full border-b-[0.5px] border-solid border-[#A9A9A9] pt-5 pb-3 xl:pt-6'>
        <h1 className='font-mont font-semibold text-sm text-custom-primaryColor text-center'>
          Cake-LP Pancake Lps
        </h1>
      </div>
      <div className='py-6 border-b-[0.5px] border-solid border-[#A9A9A9] w-full'>
        <div>
          <h1 className='font-mont text-[12px] xl:text-sm font-medium text-[#474646]'>
            Token Locker
          </h1>
          <h1 className='font-mont font-bold text-base lg:text-xl xl:text-2xl text-custom-accentColor pt-1'>
            {locker}
          </h1>
        </div>
        <div className='flex items-center justify-center gap-x-2 py-6'>
          <img src='/assets/icons/calendar.svg' alt='' />
          <h1 className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-custom-primaryColor'>
            {date} at {time}
          </h1>
        </div>
        <div>
          <div className='flex items-center justify-center gap-x-2 text-center'>
            <img src='/assets/icons/lock.svg' alt='' />
            <h1 className='font-mont font-medium text-[12px] xl:text-sm text-custom-primaryColor'>
              {amount}
            </h1>
          </div>
          {/* <div className='flex items-center justify-center gap-x-2 text-center pt-1'>
            <h1 className='font-mont font-medium text-[12px] xl:text-sm text-[#474646]'>
              Vesting Percent:
            </h1>
            <h1 className='font-mont font-medium text-[12px] xl:text-sm text-[#474646]'>
              {token_percent}
            </h1>
          </div> */}
        </div>
      </div>
      <div className='py-4 xl:py-6'>
        <h1 className='font-mont text-[12px] xl:text-sm font-medium text-[#474646]'>
          Token Address:
        </h1>
        <h1 className='font-mont font-bold text-sm xl:text-base text-custom-accentColor pt-1'>
          {String(token).slice(0,9) + " . . . " + String(token).slice(-7)}
        </h1>
      </div>
    </div>
  );
};

export const LockOptionsModal = props => {
  const { handleToggle, handleLockOptions, activeLockOption, handleSubmit, newOwner } = props;
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-[#00000070] flex justify-center items-center'>
      <div className='px-10 py-5 w-[350px] lg:w-[400px] xl:w-[450px] bg-white rounded-[21px]'>
        <div className='w-full border-b-[0.5px] border-solid border-[#606060] py-3 flex items-center justify-center'>
          <h1 className='font-mont text-center font-semibold text-lg  text-custom-primaryColor mx-auto -mr-5'>
            Lock Option
          </h1>
          <button
            className='outline-none w-[fit-content] ml-auto'
            onClick={handleToggle}
          >
            <img src='/assets/icons/cancel.svg' alt='' />
          </button>
        </div>
        <div className='pt-10 pb-7 flex flex-col gap-y-5'>
          <div
            onClick={() => handleLockOptions('self')}
            className='hover:cursor-pointer border-[0.5px] border-solid w-full xl:w-[90%] mx-auto h-[46px] border-[#A9A9A9] rounded-[10px] px-3 lg:px-7 flex items-center justify-between'
            style={{
              borderColor: activeLockOption === 'self' && accentColor,
              borderWidth: activeLockOption === 'self' && 2,
            }}
          >
            <h1
              className='font-mont font-medium text-[12px] text-[#434242]'
              style={{
                color: activeLockOption === 'self' && accentColor,
              }}
            >
              Lock for self
            </h1>
            {activeLockOption === 'self' && (
              <img src='/assets/icons/check-circle.svg' alt='' />
            )}
          </div>
          <div
            onClick={() => handleLockOptions('new_owner')}
            className='hover:cursor-pointer border-[0.5px] border-solid w-full xl:w-[90%] mx-auto h-[46px]  border-[#A9A9A9] rounded-[10px] px-3 lg:px-7 flex items-center justify-between'
            style={{
              borderColor: activeLockOption === 'new_owner' && accentColor,
              borderWidth: activeLockOption === 'new_owner' && 2,
            }}
          >
            <h1
              className='font-mont font-medium text-[12px]  text-[#434242]'
              style={{
                color: activeLockOption === 'new_owner' && accentColor,
              }}
            >
              Lock for new owner
            </h1>
            {activeLockOption === 'new_owner' && (
              <img src='/assets/icons/check-circle.svg' alt='' />
            )}
          </div>

          {activeLockOption === 'new_owner' && (
            <div className='w-full xl:w-[90%] mx-auto'>
              <label
                htmlFor='new_owner'
                className='font-mont font-medium text-[12px]  text-[#474646]'
              >
                Enter new owner address
              </label>
              <input
                type='text'
                onChange={newOwner}
                className='outline-none flex-1 mt-1 h-[46px] pl-5 xl:pl-9 pr-7 bg-custom-activeNavBgColor rounded-[10px] text-[12px] font-mont text-[#474646] w-full'
              />
            </div>
          )}

          <button onClick={handleSubmit} className='outline-none mt-3 xl:mt-6 justify-center items-center bg-custom-accentColor hover:bg-opacity-90 mx-auto rounded-[10px] w-full xl:w-[284px] h-[46px]'>
            <h1 className='font-mont font-bold text-[12px] text-white'>
              Lock tokens
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
};


export const ManageLockedTabContent = props => {
  const app = useAppContext();
  const {firstView, handleFirstView} = props;
  const [disclaimer, setDisclaimer] = useState(true);
  let days = 0;
  const handleDisclaimer = () => setDisclaimer(prevState => !prevState);
  console.log(tokenData);

  function remDays(unlockDate){
    let now = Date.now();
    // get total seconds between the times
    if (now<unlockDate*1000){
    var delta = Math.abs(unlockDate*1000 - now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    
    return (days);
  }
  return ("0");
  }
  function remTime(unlockDate){
    let now = Date.now();
    // get total seconds between the times
    if (now<unlockDate*1000){
    var delta = Math.abs(unlockDate*1000 - now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60; 

    return (hours+":"+minutes+":"+String(seconds).slice(0,2));

  }
  return ("00:00:00");
  }
  return (
    <div>
      {firstView && (
        <div>
          <div className='lg:hidden pt-10'>
            <h1 className='font-mont font-base font-semibold text-[#000]'>
              Token Locker
            </h1>
            <h1 className='font-mont pt-1 font-medium text-[#8C8C8C] text-[12px]'>
              Use the SaleX Token Locker to lock your LP tokens to show your
              investors proof of locked liquidity!
            </h1>
          </div>
          <div className='w-full h-[46px] pl-5 rounded-[73px] xl:w-[42%] flex items-center gap-x-3 bg-[#F6F7FC] mt-5 lg:mt-10'>
            <img src='/assets/icons/search.svg' alt='' />
            <input
              type='text'
              placeholder='Search by token address (Ex 0xfhfk34j4j321...)'
              className='flex-1 outline-none bg-[#F6F7FC] h-full text-[12px] font-mont text-[#000] placeholder-[#474646] '
            />
            <button className='outline-none rounded-[59px] bg-custom-accentColor w-[113px] lg:w-[126px] h-[42px] flex justify-center items-center'>
              <h1 className='font-bold font-mont text-[12px] text-white'>
                Search
              </h1>
            </button>
          </div>
          <div className='pt-10 lg:pt-7 flex items-center flex-wrap xl:flex-nowrap justify-center gap-6'>
            {lockData.map((data, i) => (
              <div className='w-full lg:w-[45%] xl:w-[24.5%]'>
                <LockedTokenCard {...data} handleFirstView={handleFirstView} />
              </div>
            ))}
          </div>
          {/* pagination */}
          <div className='flex gap-x-8 items-center justify-center pt-12'>
            {[...Array(4)].map((_, i) => (
              <button
                key={i}
                className='outline-none font-semibold first:font-bold font-mont text-[12px] xl:text-sm text-[#A9A9A9] first:text-[#000]'
              >
                <h1 className=''>{i + 1}</h1>
              </button>
            ))}
            <button className='outline-none'>
              <h1 className='font-semibold font-mont text-[12px] xl:text-sm text-[#A9A9A9]'>
                Next Page
              </h1>
            </button>
          </div>
        </div>
      )}

      {!firstView && (
        <>
          <h1 className='pt-8 pb-4 font-semibold font-mont font-xl text-custom-primaryColor'>
            Locked Liquidity Details
          </h1>
          <div className='lg:pb-8 lg:flex gap-x-6 border-[0.5px] border-solid border-[#1A2B6B] lg:border-none rounded-[10px] px-6 lg:px-0 lg:rounded-none w-full'>
            <div className='w-full mb-6 lg:mb-0 lg:w-[40%] bg-white lg:border-[0.5px] border-none lg:border-solid border-[#1A2B6B] rounded-[10px] py-5 lg:px-4'>
              <div className='w-full pb-3 border-b-[0.5px] border-solid border-[#A9A9A9]'>
                <div className='hidden w-[fit-content] overflow-hidden p-1 bg-[#F6F7FC] rounded-[10px] lg:flex gap-x-1'>
                  <div className='border-r-[0.5px] p-[2px] xl:p-1 border-solid border-[#A9A9A9]'>
                    <h1 className='font-medium font-mont text-[8px] xl:text-[12px] text-[#474646]'>
                      Owner
                    </h1>
                  </div>
                  <h1 className='font-medium font-mont text-[8px] xl:text-[12px] text-custom-accentColor p-1'>
                    {app.accountAddress}
                  </h1>
                </div>
                <div className='lg:pt-2 xl:pt-4 pb-1 flex justify-between items-center'>
                  <div className='flex items-center gap-x-3'>
                    {/* <img
                      src='/assets/images/owner.svg'
                      alt=''
                      className='w-10 xl:w-auto'
                    /> */}
                    <h1 className='font-semibold font-mont text-sm xl:text-2xl text-custom-primaryColor leading-[29px] uppercase'>
                      {tokenData[0].tokenName}
                    </h1>
                  </div>
                  <h1 className='font-mont font-semibold text-[10px] xl:text-sm text-custom-accentColor underline'>
                    {tokenData[0].tokenAdr}
                  </h1>
                </div>
              </div>
              <div className='pt-6 pb-4 flex flex-col gap-y-3'>
                
                  <div>
                    <div  className='flex justify-between items-center'>
                      <h1 className='font-medium font-mont text-[10px] xl:text-sm text-[#474646]'>
                        Tokens Balance{' '}
                      </h1>
                      <h1 className='font-semibold font-mont text-[10px] xl:text-sm text-[#000000]'>
                        {tokenData[0].tokenBalance}
                      </h1>
                    </div>
                    <div  className='flex justify-between items-center'>
                      <h1 className='font-medium font-mont text-[10px] xl:text-sm text-[#474646]'>
                      Locked Tokens{' '}
                      </h1>
                      <h1 className='font-semibold font-mont text-[10px] xl:text-sm text-[#000000]'>
                        {tokenData[0].lockedTokens}
                      </h1>
                    </div><div  className='flex justify-between items-center'>
                      <h1 className='font-medium font-mont text-[10px] xl:text-sm text-[#474646]'>
                      Unlock Date{' '}
                      </h1>
                      <h1 className='font-semibold font-mont text-[10px] xl:text-sm text-[#000000]'>
                        {new Date(tokenData[0].unlockDate*1000).toDateString() +" at " + new Date(tokenData[0].unlockDate*1000).toTimeString()}
                      </h1>
                    </div>
                  </div>
                    
                
              </div>
            </div>
            <div className='flex-1'>
              <div
                onClick={handleDisclaimer}
                className='border-none lg:border-[0.5px] lg:border-solid border-[#A9A9A9] bg-[#F6F7FC] rounded-[10px] py-5 lg:py-3 xl:py-4 lg:px-3 xl:px-5 w-full flex flex-col-reverse lg:flex-row items-center'
              >
                <div className='hidden  pt-6 lg:pt-0 lg:flex items-center justify-between gap-x-5 xl:gap-x-10 pl-4 pr-4'>
                  <h1 className=' font-mont font-semibold text-[12px] lg:text-[10px] xl:text-sm text-custom-accentColor whitespace-nowrap underline'>
                    LP TOKEN Address
                  </h1>
                  <h1 className='font-mont font-semibold whitespace-nowrap text-[12px] lg:text-[10px] xl:text-sm text-custom-accentColor underline'>
                    WBNB Address
                  </h1>
                </div>
                <div className='w-full flex lg:block flex-col justify-center items-center border-none lg:border-l-[0.5px] lg:border-solid border-[#A9A9A9] pl-4'>
                  <h1 className='font-mont text-sm lg:text-[12px] xl:text-lg font-medium text-[#474646]'>
                    Timeline to next unlock
                  </h1>
                  <h1 className='pt-1 xl:pt-2 pb-1'>
                    <span className='font-mont text-3xl lg:text-2xl xl:text-5xl font-bold text-custom-accentColor'>
                      {remDays(tokenData[0].unlockDate)}
                    </span>
                    <span className='pl-1 lg:pl-4 font-mont text-sm lg:text-[12px] xl:text-lg font-semibold uppercase text-[#474646]'>
                      DAYS
                    </span>
                  </h1>
                  <h1 className='font-medium text-sm lg:text-[10px] xl:text-sm text-[#2C2C2C]'>
                    {remTime(tokenData[0].unlockDate)}
                  </h1>
                </div>
              </div>

              <div className='lg:hidden pt-6 lg:pt-0 flex items-center justify-between gap-x-5 xl:gap-x-10 pl-4 pr-4'>
                <h1 className=' font-mont font-semibold text-[12px] lg:text-[10px] xl:text-sm text-custom-accentColor whitespace-nowrap underline'>
                  LP TOKEN Address
                </h1>
                <h1 className='font-mont font-semibold whitespace-nowrap text-[12px] lg:text-[10px] xl:text-sm text-custom-accentColor underline'>
                  WBNB Address
                </h1>
              </div>

              <div className='mt-6 border-none lg:border-[0.5px] lg:border-solid border-[#A9A9A9] lg:bg-[#F6F7FC] rounded-[10px] py-5 lg:px-7 w-full'>
                {disclaimer && (
                  <div>
                    <h1 className='font-mont font-semibold text-sm xl:text-lg text-[#474646]'>
                      Disclaimer
                    </h1>
                    <p className='font-mont text-[10px] xl:text-sm text-[#E21010] leading-5 pt-2 xl:pt-3'>
                      Please be aware that only the LP Tokens are locked in the
                      contract. Circulating tokens are not locked here and any
                      unlocked circulating tokens can be sold at any time to
                      withdraw the underlying liquidity! Please always do strong
                      research before investing in any products.
                    </p>
                  </div>
                )}

                {!disclaimer && <div>Vesting Table</div>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


export const LpManageLockedTabContent = props => {
  const app = useAppContext();
  const {firstView, handleFirstView} = props;
  const [disclaimer, setDisclaimer] = useState(true);
  let days = 0;
  const handleDisclaimer = () => setDisclaimer(prevState => !prevState);
  console.log(lpData);

  function remDays(unlockDate){
    let now = Date.now();
    // get total seconds between the times
    if (now<unlockDate*1000){
    var delta = Math.abs(unlockDate*1000 - now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    
    return (days);
  }
  return ("0");
  }
  function remTime(unlockDate){
    let now = Date.now();
    // get total seconds between the times
    if (now<unlockDate*1000){
    var delta = Math.abs(unlockDate*1000 - now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60; 

    return (hours+":"+minutes+":"+String(seconds).slice(0,2));

  }
  return ("00:00:00");
  }
  return (
    <div>
      {firstView && (
        <div>
          <div className='lg:hidden pt-10'>
            <h1 className='font-mont font-base font-semibold text-[#000]'>
              Token Locker
            </h1>
            <h1 className='font-mont pt-1 font-medium text-[#8C8C8C] text-[12px]'>
              Use the SaleX Token Locker to lock your LP tokens to show your
              investors proof of locked liquidity!
            </h1>
          </div>
          <div className='w-full h-[46px] pl-5 rounded-[73px] xl:w-[42%] flex items-center gap-x-3 bg-[#F6F7FC] mt-5 lg:mt-10'>
            <img src='/assets/icons/search.svg' alt='' />
            <input
              type='text'
              placeholder='Search by token address (Ex 0xfhfk34j4j321...)'
              className='flex-1 outline-none bg-[#F6F7FC] h-full text-[12px] font-mont text-[#000] placeholder-[#474646] '
            />
            <button className='outline-none rounded-[59px] bg-custom-accentColor w-[113px] lg:w-[126px] h-[42px] flex justify-center items-center'>
              <h1 className='font-bold font-mont text-[12px] text-white'>
                Search
              </h1>
            </button>
          </div>
          <div className='pt-10 lg:pt-7 flex items-center flex-wrap xl:flex-nowrap justify-center gap-6'>
            {lpLockData.map((data, i) => (
              <div className='w-full lg:w-[45%] xl:w-[24.5%]'>
                <LockedTokenCard {...data} handleFirstView={handleFirstView} />
              </div>
            ))}
          </div>
          {/* pagination */}
          <div className='flex gap-x-8 items-center justify-center pt-12'>
            {[...Array(4)].map((_, i) => (
              <button
                key={i}
                className='outline-none font-semibold first:font-bold font-mont text-[12px] xl:text-sm text-[#A9A9A9] first:text-[#000]'
              >
                <h1 className=''>{i + 1}</h1>
              </button>
            ))}
            <button className='outline-none'>
              <h1 className='font-semibold font-mont text-[12px] xl:text-sm text-[#A9A9A9]'>
                Next Page
              </h1>
            </button>
          </div>
        </div>
      )}

      {!firstView && (
        <>
          <h1 className='pt-8 pb-4 font-semibold font-mont font-xl text-custom-primaryColor'>
            Locked Liquidity Details
          </h1>
          <div className='lg:pb-8 lg:flex gap-x-6 border-[0.5px] border-solid border-[#1A2B6B] lg:border-none rounded-[10px] px-6 lg:px-0 lg:rounded-none w-full'>
            <div className='w-full mb-6 lg:mb-0 lg:w-[40%] bg-white lg:border-[0.5px] border-none lg:border-solid border-[#1A2B6B] rounded-[10px] py-5 lg:px-4'>
              <div className='w-full pb-3 border-b-[0.5px] border-solid border-[#A9A9A9]'>
                <div className='hidden w-[fit-content] overflow-hidden p-1 bg-[#F6F7FC] rounded-[10px] lg:flex gap-x-1'>
                  <div className='border-r-[0.5px] p-[2px] xl:p-1 border-solid border-[#A9A9A9]'>
                    <h1 className='font-medium font-mont text-[8px] xl:text-[12px] text-[#474646]'>
                      Owner
                    </h1>
                  </div>
                  <h1 className='font-medium font-mont text-[8px] xl:text-[12px] text-custom-accentColor p-1'>
                    {app.accountAddress}
                  </h1>
                </div>
                <div className='lg:pt-2 xl:pt-4 pb-1 flex justify-between items-center'>
                  <div className='flex items-center gap-x-3'>
                    {/* <img
                      src='/assets/images/owner.svg'
                      alt=''
                      className='w-10 xl:w-auto'
                    /> */}
                    <h1 className='font-semibold font-mont text-sm xl:text-2xl text-custom-primaryColor leading-[29px] uppercase'>
                      {lpData[0].token0Name}/{lpData[0].token1Name}
                    </h1>
                  </div>
                  <h1 className='font-mont font-semibold text-[10px] xl:text-sm text-custom-accentColor underline'>
                    {lpData[0].lpAdr}
                  </h1>
                </div>
              </div>
              <div className='pt-6 pb-4 flex flex-col gap-y-3'>
                
                  <div>
                    <div  className='flex justify-between items-center'>
                      <h1 className='font-medium font-mont text-[10px] xl:text-sm text-[#474646]'>
                        Tokens Balance{' '}
                      </h1>
                      <h1 className='font-semibold font-mont text-[10px] xl:text-sm text-[#000000]'>
                        {lpData[0].lpBalance}
                      </h1>
                    </div>
                    <div  className='flex justify-between items-center'>
                      <h1 className='font-medium font-mont text-[10px] xl:text-sm text-[#474646]'>
                      Locked Tokens{' '}
                      </h1>
                      <h1 className='font-semibold font-mont text-[10px] xl:text-sm text-[#000000]'>
                        {lpData[0].lockedAmount}
                      </h1>
                    </div><div  className='flex justify-between items-center'>
                      <h1 className='font-medium font-mont text-[10px] xl:text-sm text-[#474646]'>
                      Unlock Date{' '}
                      </h1>
                      <h1 className='font-semibold font-mont text-[10px] xl:text-sm text-[#000000]'>
                        {new Date(lpData[0].unlockDate*1000).toDateString() +" at " + new Date(lpData[0].unlockDate*1000).toTimeString()}
                      </h1>
                    </div>
                  </div>
                    
                
              </div>
            </div>
            <div className='flex-1'>
              <div
                onClick={handleDisclaimer}
                className='border-none lg:border-[0.5px] lg:border-solid border-[#A9A9A9] bg-[#F6F7FC] rounded-[10px] py-5 lg:py-3 xl:py-4 lg:px-3 xl:px-5 w-full flex flex-col-reverse lg:flex-row items-center'
              >
                <div className='hidden  pt-6 lg:pt-0 lg:flex items-center justify-between gap-x-5 xl:gap-x-10 pl-4 pr-4'>
                  <h1 className=' font-mont font-semibold text-[12px] lg:text-[10px] xl:text-sm text-custom-accentColor whitespace-nowrap underline'>
                    LP TOKEN Address
                  </h1>
                  <h1 className='font-mont font-semibold whitespace-nowrap text-[12px] lg:text-[10px] xl:text-sm text-custom-accentColor underline'>
                    WBNB Address
                  </h1>
                </div>
                <div className='w-full flex lg:block flex-col justify-center items-center border-none lg:border-l-[0.5px] lg:border-solid border-[#A9A9A9] pl-4'>
                  <h1 className='font-mont text-sm lg:text-[12px] xl:text-lg font-medium text-[#474646]'>
                    Timeline to next unlock
                  </h1>
                  <h1 className='pt-1 xl:pt-2 pb-1'>
                    <span className='font-mont text-3xl lg:text-2xl xl:text-5xl font-bold text-custom-accentColor'>
                      {remDays(lpData[0].unlockDate)}
                    </span>
                    <span className='pl-1 lg:pl-4 font-mont text-sm lg:text-[12px] xl:text-lg font-semibold uppercase text-[#474646]'>
                      DAYS
                    </span>
                  </h1>
                  <h1 className='font-medium text-sm lg:text-[10px] xl:text-sm text-[#2C2C2C]'>
                    {remTime(lpData[0].unlockDate)}
                  </h1>
                </div>
              </div>

              <div className='lg:hidden pt-6 lg:pt-0 flex items-center justify-between gap-x-5 xl:gap-x-10 pl-4 pr-4'>
                <h1 className=' font-mont font-semibold text-[12px] lg:text-[10px] xl:text-sm text-custom-accentColor whitespace-nowrap underline'>
                  {lpData[0].token0Adr+" Address"}
                </h1>
                </div>
                <div
                onClick={()=> window.open("https://rinkeby.etherscan.io/address/"+lpDate[0].lpAdr, "_blank")}
                className='lg:hidden pt-6 lg:pt-0 flex items-center justify-between gap-x-5 xl:gap-x-10 pl-4 pr-4'>
                <h1 className='font-mont font-semibold whitespace-nowrap text-[12px] lg:text-[10px] xl:text-sm text-custom-accentColor underline'>
                {lpData[0].token1Adr+" Address"}

                </h1>
              </div>

              <div className='mt-6 border-none lg:border-[0.5px] lg:border-solid border-[#A9A9A9] lg:bg-[#F6F7FC] rounded-[10px] py-5 lg:px-7 w-full'>
                {disclaimer && (
                  <div>
                    <h1 className='font-mont font-semibold text-sm xl:text-lg text-[#474646]'>
                      Disclaimer
                    </h1>
                    <p className='font-mont text-[10px] xl:text-sm text-[#E21010] leading-5 pt-2 xl:pt-3'>
                      Please be aware that only the LP Tokens are locked in the
                      contract. Circulating tokens are not locked here and any
                      unlocked circulating tokens can be sold at any time to
                      withdraw the underlying liquidity! Please always do strong
                      research before investing in any products.
                    </p>
                  </div>
                )}

                {!disclaimer && <div>Vesting Table</div>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};