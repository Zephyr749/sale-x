import React, { useState, Fragment, useEffect, useRef } from 'react';
import Select from 'react-select';
import Web3  from 'web3';
import  DateTime from '../../components/Input/Date';
import { useAppContext } from '../../contexts/AppContext';
import TOKEN_ABI from '../../abis/token-abi.json';
import RINKEBY from '../../constants/constant.json';
// import {TokenTimelock} from '../../abis/TokenTimelock.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// custom
import { primaryColor, accentColor } from '../../styles/variables.module.scss';
import { LaunchPadHeader } from '../../components/Launchpad/LaunchPad';
import {
  LockedTokenCard,
  LockOptionsModal,
  ManageLockedTabContent,
  SaleLockTab,
} from '../../components/SaleLock/SaleLock';
import { LOCKED_TOKENS, OWNER_LOCKED_TOKEN } from '../../Utils/data';

export const lockData = [];
export const tokenData = [];

const index = () => {
  var TokenTimelock = require('../../abis/TokenTimelock.json');
  var tokLock = require('../../abis/tokLock.json');

  const app = useAppContext();
  const [activeTab, setActiveTab] = useState('Lock Token');
  const [selectedUnlockTime, setSelectedUnlockTime] = useState(null);
  const [selectedVestingPeriod, setSelectedVestingPeriod] = useState(null);
  const [lockOptionsModal, setLockOptionsModal] = useState(false);
  const [activeLockOption, setActiveLockOption] = useState('self');
  const [tokenRelease, setTokenRelease] = useState('release-all');
  const [proceed, setProceed] = useState(true);
  const [autoVesting, setAutoVesting] = useState(null);
  const [addMoreVesting, setAddMoreVesting] = useState(1);
  const [activeManualVesting, setActiveManualVesting] = useState(0);
  const [lpBal, setLpBal]=useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [inputSec, setInputSec] = useState(0);
  const [lockValue, setLockValue]= useState(0);
  const [lockDate, setLockDate]=useState("");
  const [tokenAddress, setTokenAddress] = useState();
  const [diffOwner, setDiffOwner]=useState("");
  const [vestPeriod, setVestPeriod]=useState(1);
  const [tokenName, setTokenName] =useState("");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [firstView, setFirstView] = useState(true);
  const [index, setIndex] = useState(null);
  const [decimals, setDecimals] = useState(0);
  const [defaultDate, setDefaultDate] = useState("");
 
  const [feesApproved, setFeesApproved] = useState(false);
  const [amountApproved, setAmountApproved] =useState(false);

  const handleApprove = async(e) => {
    if(amount<=balance){
    // console.log("inside submit")
    // let date = new Date(lockDate);
    // let inputDate = Math.floor(date.getTime()/1000);
    // setInputSec(inputDate);

    // console.log(inputDate);
    let beneficiary = "";
    if(diffOwner!==""){
      beneficiary = diffOwner;
    }
    else{
      beneficiary = app.accountAddress;
    }
    console.log("diff"+diffOwner);
    console.log("token "+lpAddress);
    let web3 = new Web3(window.ethereum);
    let lockContract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI, lpAddress);
    await lockContract.methods.approve(beneficiary, String(amount)).call();
    }
  }
  
const newOwner = (e) =>{
  setDiffOwner(e.target.value);
}
const handleSubmit = async(e) => {
    if(amount<=balance){
    console.log("inside submit")
    let date = new Date(lockDate);
    let inputDate = Math.floor(date.getTime()/1000);
    setInputSec(inputDate);

    console.log("date"+inputDate);
    let beneficiary = "";
    if(diffOwner!==""){
      beneficiary = diffOwner;
    }
    else{
      beneficiary = app.accountAddress;
    }
    console.log("diff"+diffOwner);
    console.log("token "+tokenAddress);
    document.getElementById("errDate").innerHTML = "";

    if(vestPeriod<=amount){
      let web3 = new Web3(window.ethereum);
      let lockContract = new web3.eth.Contract(TokenTimelock, RINKEBY.RINKEBY.LOCK);

      try{

        console.log("amount:"+amount);
        await lockContract.methods.lock(tokenAddress, beneficiary, inputDate, amount.toString(), vestPeriod ).send({from: app.accountAddress});

    }catch(er){
        document.getElementById("errDate").innerHTML = "Invalid Date";
        console.log(er)
    } 

    }
  }

    // console.log(TokenTimelock.abi);
    // let lockContract = new web3.eth.Contract(TokenTimelock, RINKEBY.RINKEBY.LOCK).deploy(
    //   {
    //     data : '',
    //     arguments : [tokenAddress, app.accountAddress]
    //   });
    
    // console.log(tokenAddress+" and "+app.accountAddress);
    // let tokenAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
    // let web3 = new Web3(window.ethereum);
    // await window.ethereum.enable();
    // let as = JSON.parse(TokenTimelock);
    // let rs = lockContract.methods.releaseTime().call();
  }
  

  function handleVest (e) {
    setVestPeriod(e.value);
  }
  const handleAddVesting = () => {
    setAddMoreVesting(addMoreVesting + 1);
  };
  const handleRemoveVesting = () => {
    if (addMoreVesting <= 1) {
      return;
    }

    setAddMoreVesting(addMoreVesting - 1);
  };
  function handleAmount(e){
    setAmount(Number.parseInt(e.target.value) * (10**Number(decimals)));

  }
  function fromDecimals(value){
    return Number.parseInt(value) * (10**Number(decimals));
  }
  
  function toDecimals(value){
    return Number.parseInt(value) / (10**Number(decimals));
  }
  function setDate(e){
    console.log("inside date "+e.target.value);
    let lockSec = new Date(e.target.value).getTime();
    setLockDate(String(new Date(lockSec)));
    
  }
  const handleLockOptions = async(value) => {
    
    setActiveLockOption(value);
  }

  const handleProceed = async ()=>{
    setInputSec(new Date(defaultDate).getTime());
    // setLockDate(parseInt(new Date(defaultDate).getTime()));
    try{
      var adr=document.getElementById('lpAddress').value;
      setTokenAddress(adr);
      console.log(adr);
      console.log("here")

        // if(accountAddress != "0x0"){
            let web3 = new Web3(window.ethereum);
            // let bal = await web3.eth.getBalance(window.ethereum.selectedAddress);
            // setEthBal(web3.utils.fromWei(bal));
            // console.log(bal)
            let lpContract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,adr);
            let bal = await lpContract.methods.balanceOf(app.accountAddress).call()
            
            setTokenName(await lpContract.methods.name().call());
            let symbol = await lpContract.methods.symbol().call();
            setSymbol(symbol);
            setProceed(false);

            let _totalSupply = await lpContract.methods.totalSupply().call();
            let dec = await lpContract.methods.decimals().call();
            setDecimals(dec);
            // bal = (Number.parseInt(bal) / (10**Number(dec)));
            setBalance(bal);
              console.log(dec);

              _totalSupply = (Number.parseInt(_totalSupply) / (10**Number(dec)))
              setTotalSupply(_totalSupply);
              document.getElementById("errAdr").innerHTML = "";

        
       
          // setSSNBal(web3.utils.fromWei(SSNBal));
        // }

}catch(er){
  document.getElementById("errAdr").innerHTML = "Invalid Address";
  console.log(er)
}
let now = parseInt(Date.now())+ 600000;
  now = new Date(now);
  setLockDate(String(new Date(now)));
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  setDefaultDate(now.toISOString().slice(0,16));
  }

  const handleFirstView = async(i) =>{
    setIndex(i);
    if(i!== null){

      let web3 = new Web3(window.ethereum);
      let detailsContract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,lockData[i].token)
      tokenData.length= 0;
      
      tokenData.push({
        tokenName: await detailsContract.methods.name().call(),
        tokenAdr: lockData[i].token,
        tokenBalance: toDecimals(await detailsContract.methods.totalSupply().call()),
        lockedTokens: lockData[i].amount,
        unlockDate: lockData[i].releaseTime,
      })
      setFirstView(false);

    }
    else{
      setFirstView(true);
    }
    
  }

  const handleActiveTab = async (value) => {
    if(value!=="Lock Token"){
      let web3 = new Web3(window.ethereum);
      let viewContract = new web3.eth.Contract(TokenTimelock, RINKEBY.RINKEBY.LOCK);
      let length = parseInt(await viewContract.methods.lockLength(app.accountAddress).call());
      
      if(lockData.length!=length){
        
        lockData.length = 0;
        for(let i = 0; i<length; i++){
          let tokenAdr = await viewContract.methods.token(app.accountAddress, i).call();
          let lpContract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,tokenAdr);
        // console.log(length + "here" +i);
        // let tokena = await viewContract.methods.amount(app.accountAddress, i).call();
        // console.log('Token:'+tokena);
          lockData.push({
          token: tokenAdr,
          beneficiary: await viewContract.methods.beneficiary(app.accountAddress, i).call(),
          releaseTime: await viewContract.methods.releaseTime(app.accountAddress, i).call(),
          amount: Number.parseInt(await viewContract.methods.amount(app.accountAddress, i).call())/(10**Number(Number.parseInt(await lpContract.methods.decimals().call()))),
          index: i
          
        })
        
      }
    }
    handleFirstView(null);
    console.log(lockData);
    
  }
  setActiveTab(value);
  }
  function handleToggle(){
    setLockOptionsModal(!lockOptionsModal);
  }
  async function handleLockOptionsModal () {
    let web3 = new Web3(window.ethereum);

    let lockContract = new web3.eth.Contract(TokenTimelock, RINKEBY.RINKEBY.LOCK)
    let tokContract = new web3.eth.Contract(tokLock, tokenAddress);
    let ssnContract = new web3.eth.Contract(tokLock, RINKEBY.RINKEBY.TOKEN);
    let totalFee = parseInt(await lockContract.methods.totalfee().call());
    let allowance = parseInt(await ssnContract.methods.allowance(app.accountAddress, RINKEBY.RINKEBY.LOCK).call());
    if(allowance<totalFee){

       ssnContract.methods.approve(RINKEBY.RINKEBY.LOCK, "1000000000000000000000000000000000").send({from: app.accountAddress}).once('confirmation', () => {
        setFeesApproved(true);
       })
    }
    else{
      setFeesApproved(true);
    }
    // await tokContract.methods.approve(adminWalletAddress, String(adminFees)).send({from: app.accountAddress});

    //     await tokContract.methods.approve(dead, String(burnFee)).send({from: app.accountAddress});
    let tokenAllowance = parseInt(await tokContract.methods.allowance(app.accountAddress, RINKEBY.RINKEBY.LOCK).call());
    if(amount>tokenAllowance){
      tokContract.methods.approve(RINKEBY.RINKEBY.LOCK, "1000000000000000000000000000000000").send({from: app.accountAddress}).once('confirmation', ()=>{
        setAmountApproved(true);

      })
    }
    else{
      setAmountApproved(true);
    }
    toast.success('Transaction Approved', {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
      document.getElementById('approve').innerHTML = "View Lock Options";
  }
  const handleTokenRelease = value => setTokenRelease(value);

  async function setMax(){

    console.log(inputSec);

    document.getElementById('lockAmount').value=Number.parseInt(balance) / (10**Number(decimals));
  }

  return (
    <Fragment>
      <div className='py-6'>
        <button
          onClick={() => router.back()}
          className='outline-none hidden lg:flex items-center gap-x-2'
        >
          <img src='/assets/icons/arrow-left.svg' alt='' />
          <h1 className='font-mont font-semibold text-[#2C2C2C] text-sm'>
            Back
          </h1>
        </button>

        <h1 className='lg:hidden font-bold font-mont text-base text-custom-primaryColor'>
          SaleX Lock
        </h1>
        {/* tabs and tab contents */}
        <div className='pt-3 lg:pt-4'>
          {/* tab */}
          <SaleLockTab activeTab={activeTab} handleActiveTab={handleActiveTab}>
            <div title='Lock Token'>
              <div className='py-6 lg:py-16 flex flex-col lg:items-center'>
                <h1 className='font-semibold text-base lg:text-lg xl:text-2xl text-left lg:text-center font-mont text-custom-primaryColor leading-[29px]'>
                  <span className='hidden lg:inline'>Salex lock</span> Token
                  Locker
                </h1>
                <h1 className='font-medium pt-1 xl:pt-3 text-left lg:text-center text-[12px] xl:text-sm font-mont text-[#474646] leading-[17px] pr-6 lg:px-40'>
                  Use the Salex lock Token Locker to lock your tokens and earn
                  greater trust <br className='hidden lg:block' /> within your
                  community!
                </h1>
                <div className='pt-6 lg:pt-8 w-full lg:w-1/2'>
                  <div>
                    <h1
                      htmlFor='pair'
                      className='font-mont text-left font-medium text-[12px] lg:text-sm  text-[#474646]'
                    >
                      Enter Token Address
                    </h1>
                    <input
                      id='lpAddress'
                      type='text'
                      className='w-full block outline-none px-5 bg-[#F6F7FC] placeholder-[#4A4A4A] h-[46px] mt-2 rounded-[10px] text-[12px] xl:text-sm text-[#000000] font-medium'
                    />
                  </div>

                  <div className='pt-2'>
                  <div className='bg-[#F1EAFF] mt-2 w-[fit-content] p-2 lg:p-2 rounded-[2px] lg:rounded-[10px]'>
                    <h1 className='font-semibold font-mont text-[8px] lg:text-[12px] text-custom-accentColor'>
                      Token Locker Fees 0.1 nan (Flat Rate)
                    </h1>
                          </div>
                            <h1 id="errAdr" className='font-mont text-center font-medium text-[12px] text-[#E32E2E] leading-[18px]'>
                              
                            </h1>

                            
                  </div>

                  {proceed && (
                    <div className='flex justify-center py-10'>
                      <button
                        onClick={handleProceed}
                        className='outline-none w-[168px] h-[46px] py-3 px-3 bg-custom-accentColor rounded-[10px] flex justify-center items-center'
                      >
                        <h1 className='font-mont font-bold text-[12px] xl:text-sm text-white leading-6'>
                          Proceed
                        </h1>
                      </button>
                    </div>
                  )}

                  {!proceed && (
                    <Fragment>
                      <div className='pt-9 lg:pt-6 flex flex-col gap-y-2 lg:gap-y-3'>
                        <h1 className='font-medium font-mont text-[12px] xl:text-sm text-[#000]'>
                          Token Info
                        </h1>
                        <h1 className='font-medium font-mont text-[12px] text-custom-accentColor underline xl:text-sm '>
                          {tokenName}
                        </h1>

                        <h1 className='font-medium font-mont text-[12px] xl:text-sm text-[#606060]'>
                          <span className='text-custom-accentColor underline'>
                            Max Total Supply
                          </span>
                          &nbsp; &nbsp; {'-'} &nbsp; &nbsp;
                          <span className='font-normal text-[#606060] underline'>
                            {totalSupply}
                          </span>
                        </h1>
                      </div>

                      {/* inputs */}
                      <div>
                        <div className='pt-8'>
                          <div className='flex items-center justify-between'>
                            <h1 className='font-mont text-left font-medium text-[12px] lg:text-sm text-[#474646]'>
                              Amount to lock
                            </h1>
                            <h1 className='font-mont text-left font-medium text-[10px] lg:text-[12px] text-[#A9A9A9]' id='maxlockAmount'>
{Number.parseInt(balance) / (10**Number(decimals))} {" "+symbol}
                            </h1>
                          </div>
                          <div className='w-full bg-[#F6F7FC] h-[46px]  mt-2 rounded-[10px] flex items-center justify-between overflow-hidden'>
                            <input
                              id='lockAmount'
                              type='number'
                              max={balance}
                              min={0}
                              defaultValue = {0}
                              onChange={handleAmount}
                              className='outline-none w-full bg-[#F6F7FC] flex-1 px-5  placeholder-[#4A4A4A] h-full text-[12px] xl:text-sm text-[#000000] font-medium'
                            />
                            <div onClick={setMax} ><h1
                            className='font-mont pr-4 font-bold text-[12px] xl:text-sm text-custom-accentColor'>
                              Max
                            </h1>
                            </div>
                          </div>
                        </div>
                        <div className='pt-8'>
                          <div className='flex items-center justify-between'>
                            <h1 className='font-mont text-left font-medium text-[12px] lg:text-sm text-[#474646]'>
                              Token Unlock time
                            </h1>
                            <h1 className='font-mont text-left font-medium text-[10px] lg:text-[12px] text-[#A9A9A9]'>
                            </h1>
                          </div>
                          <div className='w-full bg-[#F6F7FC] h-[46px] mt-2 rounded-[10px] flex items-center justify-between pr-4'>
                            <input
                              id='pair'
                              type='text'
                              className='outline-none w-full bg-[#F6F7FC] flex-1 px-5  placeholder-[#4A4A4A] rounded-tl-[10px] rounded-bl-[10px] h-full text-[12px] xl:text-sm text-[#000000] font-medium'
                            />
                            <DateTime 
                            defaultValue={defaultDate}
                            onChange={setDate} />

                          </div>
                            <div className='pt-2'>
                            <h1 id="errDate" className='font-mont text-center font-medium text-[12px] text-[#E32E2E] leading-[18px]'>
                              
                            </h1>
                            </div>

                          {/* method of token release */}
                          <div className='pt-8'>
                            <h1 className='font-mont font-medium text-sm'>
                              Method of Token Release
                            </h1>
                            <div className='pt-2 flex items-center gap-x-4'>
                              <div
                                onClick={() => {
                                  handleTokenRelease('release-all');
                                  setAutoVesting(null);
                                }}
                                className='hover:cursor-pointer border-[0.5px] border-solid w-full xl:w-[90%] mx-auto h-[46px] border-[#A9A9A9] rounded-[10px] px-2 lg:px-6 flex items-center justify-between'
                                style={{
                                  borderColor:
                                    tokenRelease === 'release-all' && '#000000',
                                  borderWidth:
                                    tokenRelease === 'release-all' && 2,
                                }}
                              >
                                <h1
                                  className={`font-mont text-[12px] text-[#434242] font-medium ${
                                    tokenRelease === 'release-all' &&
                                    'font-semibold lg:font-bold'
                                  }`}
                                  style={{
                                    color:
                                      tokenRelease === 'release-all' &&
                                      '#000000',
                                  }}
                                >
                                  Release all at once
                                </h1>
                                {tokenRelease === 'release-all' && (
                                  <img
                                    src='/assets/icons/check-circle-black.svg'
                                    alt=''
                                  />
                                )}
                              </div>
                              <div
                                onClick={() => {
                                  handleTokenRelease('vesting');
                                  setAutoVesting(true);
                                }}
                                className='hover:cursor-pointer border-[0.5px] border-solid w-full xl:w-[90%] mx-auto h-[46px]  border-[#A9A9A9] rounded-[10px] px-2 lg:px-6 flex items-center justify-between'
                                style={{
                                  borderColor:
                                    tokenRelease === 'vesting' && '#000000',
                                  borderWidth: tokenRelease === 'vesting' && 2,
                                }}
                              >
                                <h1
                                  className={`font-mont text-[12px] text-[#434242] font-medium ${
                                    tokenRelease === 'release-all' &&
                                    'font-semibold lg:font-bold'
                                  }`}
                                  style={{
                                    color:
                                      tokenRelease === 'vesting' && '#000000',
                                  }}
                                >
                                  Vesting
                                </h1>
                                {tokenRelease === 'vesting' && (
                                  <img
                                    src='/assets/icons/check-circle-black.svg'
                                    alt=''
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            {autoVesting != null && (
                              <div className='pt-4 pb-6 flex items-center justify-between'>
                                <h1 className='font-mont font-semibold text-[12px] text-custom-primaryColor'>
                                  {autoVesting != null && autoVesting
                                    ? 'Auto'
                                    : 'Manual'}{' '}
                                  Vesting
                                </h1>
                                <h1
                                  className='font-mont hover:cursor-pointer font-bold text-[12px] text-custom-accentColor underline'
                                  onClick={() => setAutoVesting(!autoVesting)}
                                >
                                  Switch to{' '}
                                  {autoVesting != null && !autoVesting
                                    ? 'Auto'
                                    : 'Manual'}{' '}
                                  vesting
                                </h1>
                              </div>
                            )}

                            {autoVesting && (
                              <>
                                <h1 className='font-mont text-left font-medium text-[12px]  text-[#474646]'>
                                  Select Vesting period
                                </h1>
                                <div className='mt-1 w-full'>
                                  <Select
                                    placeholder='No vesting, all tokens will be released at unlock time'
                                    defaultValue={selectedVestingPeriod}
                                    options={VESTING_PERIOD}
                                    onChange={handleVest}
                                    styles={vestingPeriodStyles}
                                  />
                                </div>
                              </>
                            )}

                            {autoVesting != null && !autoVesting && (
                              <div className='flex flex-col gap-3'>
                                {[...Array(addMoreVesting)].map((_, i) => (
                                  <div>
                                    <label
                                      htmlFor=''
                                      className='block text-[#474646] pb-2 font-medium font-mont text-[12px]'
                                    >
                                      Vesting period {i + 1}
                                    </label>

                                    <div className='flex w-full items-center gap-3 lg:gap-5'>
                                      {activeManualVesting === i && (
                                        <button
                                          onClick={() => {
                                            handleRemoveVesting();
                                            setActiveManualVesting(i - 1);
                                          }}
                                          className='outline-none lg:hidden'
                                        >
                                          <img
                                            src='/assets/icons/minus.svg'
                                            alt=''
                                          />
                                        </button>
                                      )}
                                      <input
                                        type='text'
                                        placeholder='Days'
                                        className='outline-none w-[47%] bg-[#F6F7FC] px-5  placeholder-[#4A4A4A] rounded-[10px] h-[46px] text-[12px] text-[#000000] font-medium'
                                      />
                                      <div className=' w-8 border-b-2 border-solid border-[#474646]'></div>
                                      <input
                                        type='text'
                                        placeholder='% to release'
                                        className='outline-none w-[47%] bg-[#F6F7FC] px-5  placeholder-[#4A4A4A] rounded-[10px] h-[46px] text-[12px] text-[#000000] font-medium'
                                      />
                                      {activeManualVesting === i && (
                                        <div className='flex flex-col gap-y-[2px] justify-center'>
                                          <button
                                            onClick={() => {
                                              handleAddVesting();
                                              setActiveManualVesting(i + 1);
                                            }}
                                            className='outline-none'
                                          >
                                            <img
                                              src='/assets/icons/plus.svg'
                                              alt=''
                                            />
                                          </button>
                                          {activeManualVesting !== 0 && (
                                            <button
                                              onClick={() => {
                                                handleRemoveVesting();
                                                setActiveManualVesting(i - 1);
                                              }}
                                              className='outline-none hidden lg:block'
                                            >
                                              <img
                                                src='/assets/icons/minus.svg'
                                                alt=''
                                              />
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className='pt-7 flex flex-col gap-y-3'>
                            <div className='flex items-center justify-between'>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm  text-[#000000]'>
                                Service fee:
                              </h1>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm  text-custom-accentColor'>
                                0.00696SSN
                              </h1>
                            </div>
                            <div className='flex items-center justify-between'>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm  text-[#000000]'>
                                Total Lp Tokens
                              </h1>
                              <h1 id = "totalSupply" className='font-mont font-medium text-[12px] lg:text-sm  text-[#474646]'>
                                  {totalSupply}
                              </h1>
                            </div>
                            <div className='flex items-center justify-between'>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm  text-[#000000]'>
                                Your Lp Tokens to be Locked:
                              </h1>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm  text-[#474646]'>
                                {Number.parseInt(amount) / (10**Number(decimals))}/{Number.parseInt(balance) / (10**Number(decimals))}
                              </h1>
                            </div>
                            <div className='flex items-center justify-between'>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm  text-[#000000]'>
                                Unlock date: 

                              </h1>
                              <h1 id="vUnlockDate" className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-[#474646]'>
                              {lockDate}
                              </h1>
                            </div>
                          </div>

                          <div className='flex items-center gap-x-8 pt-6'>
                            <button
                              onClick={async (e)=>{
                                if(feesApproved && amountApproved){
      
                                  setLockOptionsModal(!lockOptionsModal);
                                                                
                                }
                                else{
                                  await handleLockOptionsModal()
                                  
                                }
                            
                              }}

                              className='outline-none flex-1 h-[46px] py-3 px-3 bg-custom-accentColor rounded-[10px] flex justify-center items-center'
                            >
                              <h1 id="approve" className='font-mont font-bold text-[12px] xl:text-sm text-white leading-6'>
                                Approve
                              </h1>
                            </button>
                            <ToastContainer
                                    position="top-center"
                                    autoClose={4000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                  />  
                          </div>

                          <div className='pt-7'>
                            <h1 className='font-mont text-center font-medium text-[12px] text-[#E32E2E] leading-[18px]'>
                              For tokens with special transfers burns, tax or
                              other fees make sure the Salex lock address is
                              whitelisted(excludeFromFee) before you deposit or
                              you won't be able to withdraw!
                            </h1>

                            <h1 className='text-[#4A4A4A] text-center pt-7 font-mont font-medium text-[12px] xl:text-sm'>
                              SaleXLock Address: nan
                            </h1>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>

            <ManageLockedTabContent title='Manage Locked Tokens'
            firstView = {firstView}
            handleFirstView= {handleFirstView} />
          </SaleLockTab>
        </div>
      </div>

      {lockOptionsModal && (
        <LockOptionsModal
          handleToggle={handleToggle}
          activeLockOption={activeLockOption}
          handleLockOptions={handleLockOptions}
          handleSubmit={handleSubmit}
          newOwner={newOwner}
        />
      )}
    </Fragment>
  );
};

export default index;

const selectedUnlockStyles = {
  indicatorSeparator: styles => ({
    ...styles,
    border: 'none',
    display: 'none',
  }),
  input: styles => ({
    ...styles,
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'Montserrat',
    color: primaryColor,
    '@media only screen and (max-width: 1024px)': {
      ...styles['@media only screen and (max-width: 1024px)'],
      fontSize: 12,
      color: '#000',
    },
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: '16px',
    color: '#393939',
    padding: 0,
    '@media only screen and (max-width: 1024px)': {
      ...styles['@media only screen and (max-width: 1024px)'],
      fontSize: 12,
      color: '#000',
    },
  }),
  control: (styles, state) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    lineHeight: 1.25,
    backgroundColor: 'white',
    border: 'none',
    height: 36,
    borderRadius: 10,
    width: 139,
    '@media only screen and (max-width: 1024px)': {
      ...styles['@media only screen and (max-width: 1024px)'],
      height: 38,
      borderRadius: 5,
      padding: 0,
      width: 81,
    },
  }),
};

const vestingPeriodStyles = {
  indicatorSeparator: styles => ({
    ...styles,
    border: 'none',
    display: 'none',
  }),
  input: styles => ({
    ...styles,
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'Montserrat',
    color: primaryColor,
    '@media only screen and (max-width: 1024px)': {
      ...styles['@media only screen and (max-width: 1024px)'],
      fontSize: 10,
      color: '#000',
    },
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: '12px',
    color: '#393939',
    padding: 0,
    '@media only screen and (max-width: 1024px)': {
      ...styles['@media only screen and (max-width: 1024px)'],
      fontSize: 10,
      color: '#000',
    },
  }),
  control: (styles, state) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    lineHeight: 1.25,
    backgroundColor: 'white',
    border: 'none',
    height: 46,
    borderRadius: 10,
    width: '100%',
    border: '0.5px solid #000248',
    '@media only screen and (max-width: 1024px)': {
      ...styles['@media only screen and (max-width: 1024px)'],
      height: 46,
      borderRadius: 5,
      padding: 0,
    },
  }),
};

const LIQUIDITY_UNLOCK_TIME = [
  { label: 'All Listings', value: 'All Listings' },
  {
    label: 'Admiral Container Lines',
    value: 'ADMU',
  },
  { label: 'Alianca', value: 'ANRM' },
  {
    label: 'American President Lines (APL)',
    value: 'APLU',
  },
  { label: 'Arkas', value: 'ARKU' },
];

const VESTING_PERIOD = [
  { label: '2 vesting period', value: '2' },
  {
    label: '3 vesting period',
    value: '3',
  },
  {
    label: '4 vesting period',
    value: '4',
  },
  {
    label: '5 vesting period',
    value: '5',
  },
  {
    label: '6 vesting period',
    value: '6',
  },

];
