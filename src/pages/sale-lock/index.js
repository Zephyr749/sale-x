import React, { useState, Fragment, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';
import Web3  from 'web3';
// custom
import { primaryColor } from '../../styles/variables.module.scss';
import { LaunchPadHeader } from '../../components/Launchpad/LaunchPad';
import {
  LockedTokenCard,
  LockOptionsModal,
  LpManageLockedTabContent,
  SaleLockTab,
} from '../../components/SaleLock/SaleLock';
import { LOCKED_TOKENS, OWNER_LOCKED_TOKEN } from '../../Utils/data';
import  DateTime from '../../components/Input/Date';
import { borderRight } from '@mui/system';
import { useAppContext } from '../../contexts/AppContext';
import RINKEBY from '../../constants/constant.json';
import TOKEN_ABI from '../../abis/token-abi.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// import ShortUniqueId from 'short-unique-id';
export const lpData = [];
export const lpLockData = [];
const index = () => {
  var LpTimelock = require('../../abis/LpTimelock.json');

  const [dataFeed,setDataFeed] = useState(null);
  var lpLock = require('../../abis/LpTimelock.json');
  var tokLock = require('../../abis/tokLock.json');
  var token_details = require('../../abis/lp_abi.json')

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Lock Liquidity');
  const [selectedUnlockTime, setSelectedUnlockTime] = useState(null);
  const [selectedVestingPeriod, setSelectedVestingPeriod] = useState(null);
  const [lockOptionsModal, setLockOptionsModal] = useState(false);
  const [activeLockOption, setActiveLockOption] = useState('self');
  const [proceed, setProceed] = useState(true);
  const [lpAddress, setLpAddress] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [balance, setBalance] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState(0);
  const [lockDate, setLockDate]=useState("");
  const [decimals, setDecimals] = useState(18);
  const [inputSec, setInputSec] = useState(0);
  const [index, setIndex] = useState(null);
  const [firstView, setFirstView] = useState(true);
  const [defaultDate, setDefaultDate] = useState("");
  const [feesApproved, setFeesApproved] = useState(false);
  const [amountApproved, setAmountApproved] =useState(false);

  const [token0, setToken0] = useState({
    address : "",
    name : "",
  });const [token1, setToken1] = useState({
    address : "",
    name : "",
  });
  

  const app = useAppContext();
  const handleLockOptions = value => setActiveLockOption(value);
  const handleLockOptionsModal = () => setLockOptionsModal(!lockOptionsModal);

  const handleSubmit = async(e) => {
    if(amount<=balance && amount>0){
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
      console.log("token "+lpAddress);
      document.getElementById("errDate").innerHTML = "";
  
      
        let web3 = new Web3(window.ethereum);
        let lockContract = new web3.eth.Contract(lpLock, RINKEBY.RINKEBY.LPLOCK);
  
        try{
  
          console.log("amount:"+amount);
          console.log("token  : "+lpAddress);

          await lockContract.methods.lock(lpAddress, beneficiary, inputDate, amount.toString(), ).send({from: app.accountAddress});
  
      }catch(er){
          document.getElementById("errDate").innerHTML = "Invalid Date";
          console.log(er)
      } 
  
      }
      else{
          toast.error('Amount must be greater than 0', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
    }
  const handleApprove = async(e) => {
    if(amount<=balance){
    let web3 = new Web3(window.ethereum);

    let lockContract = new web3.eth.Contract(lpLock, RINKEBY.RINKEBY.LPLOCK)
    let tokContract = new web3.eth.Contract(tokLock, lpAddress);
    let ssnContract = new web3.eth.Contract(tokLock, RINKEBY.RINKEBY.TOKEN);
    let totalFee = parseInt(await lockContract.methods.totalfee().call());
    let allowance = parseInt(await ssnContract.methods.allowance(app.accountAddress, RINKEBY.RINKEBY.LPLOCK).call());

    let tokenAllowance = parseInt(await tokContract.methods.allowance(app.accountAddress, RINKEBY.RINKEBY.LPLOCK).call());
    if(amount>tokenAllowance){
      tokContract.methods.approve(RINKEBY.RINKEBY.LPLOCK, "1000000000000000000000000000000000").send({from: app.accountAddress}).once('confirmation', ()=>{
        setAmountApproved(true);
        if(feesApproved && amountApproved){
          toast.success('Transaction Approved', {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        }

      })
    }
    else{
      setAmountApproved(true);
      
      
    }
    if(allowance<totalFee){

       ssnContract.methods.approve(RINKEBY.RINKEBY.LPLOCK, "1000000000000000000000000000000000").send({from: app.accountAddress}).once('confirmation', () => {
      setFeesApproved(true);
      
      
       })
    }
    else{
      setFeesApproved(true);
      
      
    }
    
    }
  }


  const handleProceed = async ()=>{
    try{
      var adr=document.getElementById('lpAddress').value;
      setLpAddress(adr);
      
        // if(accountAddress != "0x0"){
            let web3 = new Web3(window.ethereum);
            // let bal = await web3.eth.getBalance(window.ethereum.selectedAddress);
            // setEthBal(web3.utils.fromWei(bal));
            // console.log(bal)
            
            
            // setToken0({...token0, address: await lpContract.methods.token0().call(), name: await tkContract.methods.name().call() });
            // setToken1({...token0, address: await lpContract.methods.token1().call(), name: await tkContract.methods.name().call() });
            let lpContract = new web3.eth.Contract(token_details,adr);

            let token0Adr = await lpContract.methods.token0().call();
            let tk0Contract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,token0Adr);
            let token0Name = await tk0Contract.methods.name().call();
            let token1Adr = await lpContract.methods.token1().call();
            let tk1Contract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,token1Adr);
            let token1Name = await tk1Contract.methods.name().call();

            setToken0({...token0, address: token0Adr, name: token0Name});
            setToken1({...token1, address: token1Adr, name: token1Name});

            setTotalSupply(await lpContract.methods.totalSupply().call());
            setBalance(await lpContract.methods.balanceOf(app.accountAddress).call());
            setSymbol(await lpContract.methods.symbol().call());
            setDecimals(await lpContract.methods.decimals().call());
            setProceed(false);
            document.getElementById("errAdr").innerHTML = "";
            // setTokenName(await lpContract.methods.name().call());

        
            
       
          // setSSNBal(web3.utils.fromWei(SSNBal));
        // }

}catch(er){
  document.getElementById("errAdr").innerHTML = "Invalid Token Address";
  console.log(er)
  }
  
  let now = parseInt(Date.now())+ 600000;
  now = new Date(now);
  setLockDate(String(new Date(now)));
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  setDefaultDate(now.toISOString().slice(0,16));
  
}

function fromDecimals(value){
  return Number.parseInt(value) * (10**Number(decimals));
}

function toDecimals(value){
  return Number.parseInt(value) / (10**Number(decimals));
}

function handleAmount(e){
  let am = fromDecimals(e.target.value);
  console.log(am);
  setAmount(am);

}
function notifyApproveFirst(){
  toast.error('Approve Transaction First', {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
}
function notifyApproved(){
  toast.success('Transaction Approved', {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
}


async function setMax(){
 document.getElementById('lockAmount').value=Number.parseInt(balance) / (10**Number(decimals));
}
  

  function setDate(e){
    console.log("inside date "+e.target.value);
    let lockSec = new Date(e.target.value).getTime();
    setLockDate(String(new Date(lockSec)));
    
  }

  
  const handleFirstView = async(i) =>{
    setIndex(i);
    if(i!== null){

      let web3 = new Web3(window.ethereum);
     let detailsContract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,lpLockData[i].token)
     let tokeAdrContract = new web3.eth.Contract(token_details,lpLockData[i].token);

    let token0Adr = await tokeAdrContract.methods.token0().call();
    let tk0Contract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,token0Adr);
    let token0Name = await tk0Contract.methods.name().call();
    let token1Adr = await tokeAdrContract.methods.token0().call();
    let tk1Contract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,token0Adr);
    let token1Name = await tk1Contract.methods.name().call();

     lpData.length= 0;
      
     lpData.push({
       lpName: await detailsContract.methods.name().call(),
       token0Adr: token0Adr,
       token0Name: token0Name,
       token1Adr: token1Adr,
       token1Name: token1Name,
       lpAdr: lpLockData[i].token,
       lpBalance: toDecimals(await detailsContract.methods.totalSupply().call()),
       lockedAmount: lpLockData[i].amount,
       unlockDate: lpLockData[i].releaseTime,
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
       let viewContract = new web3.eth.Contract(LpTimelock, RINKEBY.RINKEBY.LPLOCK);
       let length = parseInt(await viewContract.methods.lockLength(app.accountAddress).call());
      
       if(lpLockData.length!=length){
        
         lpLockData.length = 0;
         for(let i = 0; i<length; i++){
           let tokenAdr = await viewContract.methods.token(app.accountAddress, i).call();
           let lpContract = new web3.eth.Contract(TOKEN_ABI.TOKEN_ABI,tokenAdr);
          console.log(length + "here" +i);
          let tokenAmount = await viewContract.methods.amount(app.accountAddress, i).call();
          console.log('Token:'+tokenAmount);
           lpLockData.push({
           token: tokenAdr,
           beneficiary: await viewContract.methods.beneficiary(app.accountAddress, i).call(),
           releaseTime: await viewContract.methods.releaseTime(app.accountAddress, i).call(),
           amount: toDecimals(await viewContract.methods.amount(app.accountAddress, i).call()),
           index: i
          
         })
        
       }
     }
     console.log(lpLockData);
    
   }
  handleFirstView(null);
  setActiveTab(value);
  }
  // useEffect(async ()=>{
  //   if(app.chainID == 4 && app.accountAddress != '0x0' && app.web3){

  //     let launchContract = new app.web3.eth.Contract(JSON.parse(Userinfo),RINKEBY.LAUNCH);
  //     let data = await launchContract.methods.UserBalance(app.accountAddress).call();
  //     console.log(data);
  //     setDataFeed(data)
  //   //   let tokenContract = new app.web3.eth.Contract(TOKEN_ABI,data.ico.data.lpAddress);
  //   //   let name_ = await tokenContract.methods.name().call();
  //   //   let symbol_ = await tokenContract.methods.symbol().call();
  //   //   let totalSupply_ = await tokenContract.methods.totalSupply().call();
  //   //   let decimals = await tokenContract.methods.decimals().call();
  //   //   let totalSupply = Number.parseInt(totalSupply_) / (10**Number(decimals));
  //   //   setlpData({name:name_,symbol:symbol_,totalSupply,decimals});
  //   }
  // });
  const [diffOwner, setDiffOwner]=useState("");

  const newOwner = (e) =>{
    setDiffOwner(e.target.value);
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
            <div title='Lock Liquidity'>
              <div className='py-6 lg:py-16 flex flex-col lg:items-center'>
                <h1 className='font-semibold text-base lg:text-lg xl:text-2xl text-left lg:text-center font-mont text-custom-primaryColor leading-[29px]'>
                  <span className='hidden lg:inline'>Salex lock </span>{' '}
                  Liquidity Locker
                </h1>
                <h1 className='font-medium pt-1 xl:pt-3 text-left lg:text-center text-[12px] xl:text-sm font-mont text-[#474646] leading-[17px] pr-6 lg:px-40'>
                  Use the Salex lock Liquidity Locker to lock your LP tokens to
                  show your <br className='hidden lg:block' /> investors proof
                  of locked liquidity!
                </h1>
                <div className='pt-6 lg:pt-8 w-full lg:w-1/2'>
                  <div>
                    <h1
                      htmlFor='pair'
                      className='font-mont text-left font-medium text-[12px] lg:text-sm  text-[#474646]'
                    >
                      Enter Pair Address
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
                      <div className='pt-9 lg:pt-10 flex flex-col gap-y-2 lg:gap-y-3'>
                        <h1 className='font-medium font-mont text-[12px] xl:text-sm text-[#000]'>
                          This Liquidity Pool Contains the Following Tokens
                        </h1>
                        <h1 className='font-medium font-mont text-[12px] xl:text-sm text-[#606060]'>
                          <span className='text-custom-accentColor underline'>
                            {token0.name}
                          </span>
                          &nbsp; &nbsp; {'-'} &nbsp; &nbsp;
                          <span className='font-normal text-[#606060] underline'>
                            {token0.address}
                          </span>
                        </h1>
                        <h1 className='font-medium font-mont text-[12px] xl:text-sm text-[#606060]'>
                          <span className='text-custom-accentColor underline'>
                            {token1.name}
                          </span>
                          &nbsp; &nbsp; {'-'} &nbsp; &nbsp;
                          <span className='font-normal text-[#606060] underline'>
                            {token1.address}
                          </span>
                        </h1>
                        <h1 className='font-medium font-mont text-[12px] xl:text-sm text-[#606060]'>
                          <span className='text-custom-accentColor underline'>
                          LP Token Supply
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
                            <h1 className='font-mont text-left font-medium text-[10px] lg:text-[12px] text-[#A9A9A9]'>
                            {toDecimals(balance)} {" "+symbol}
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
                            <h1 className='font-mont text-left font-medium text-[12px] lg:text-sm  text-[#474646]'>
                              Liquidity Unlock time
                            </h1>
                            <h1 className='font-mont text-left font-medium text-[10px] lg:text-[12px] text-[#A9A9A9]'>
                            </h1>
                          </div>
                          <div className='w-full bg-[#F6F7FC] h-[46px] mt-2 rounded-[10px] flex items-center justify-between pr-4'>
                            <input
                              id='date'
                              type='text'
                              className='outline-none w-full bg-[#F6F7FC] flex-1 px-5  placeholder-[#4A4A4A] rounded-tl-[10px] rounded-bl-[10px] h-full text-[12px] xl:text-sm text-[#000000] font-medium'
                            />
                            
                            <DateTime 
                            defaultValue={defaultDate}
                            onChange={setDate} />
                            </div>
                            <div>
                            <div>
                            <h1 id="errDate" className='font-mont text-center font-medium text-[12px] text-[#E32E2E] leading-[18px]'>
                              
                              </h1>
                            </div>

                            {/* <div className='px-2 flex items-center'>
                              <Select
                                placeholder='Days'
                                defaultValue={selectedUnlockTime}
                                options={LIQUIDITY_UNLOCK_TIME}
                                onChange={setSelectedUnlockTime}
                                styles={selectedUnlockStyles}
                              />
                            </div> */}
                          </div>

                          <div className='pt-12 flex flex-col gap-y-3'>
                            <div className='flex items-center justify-between'>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-[#000000]'>
                                Service fee:
                              </h1>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-custom-accentColor'>
                                0.00696SSN
                              </h1>
                            </div>
                            <div className='flex items-center justify-between'>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-[#000000]'>
                                Total Lp Tokens
                              </h1>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-[#474646]'>
                                {toDecimals(totalSupply)}
                              </h1>
                            </div>
                            <div className='flex items-center justify-between'>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-[#000000]'>
                                Your Lp Tokens to be Locked:
                              </h1>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm  text-[#474646]'>
                              {toDecimals(amount)}/{toDecimals(balance)}
                              </h1>
                              
                             
                             
                            </div>
                            <div className='flex items-center justify-between'>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-[#000000]'>
                              Unlock date:
                              </h1>
                              <h1 className='font-mont font-medium text-[12px] lg:text-sm xl:text-base text-[#474646]'>
                              {lockDate}
                              </h1>
                            </div>
                          </div>

                          <div className='flex items-center gap-x-8 pt-6'>
                            <button
                              onClick={async (e)=>{
                                if(feesApproved && amountApproved){
      
                                  await notifyApproved();
                                                                
                                }
                                else{
                                  await handleApprove();
                                  await notifyApproved();
                                }
                            
                              }}
                              className='outline-none flex-1 h-[46px] py-3 px-3 bg-custom-accentColor rounded-[10px] flex justify-center items-center'
                            >
                              <h1 className='font-mont font-bold text-[12px] xl:text-sm text-white leading-6'>
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
                            <button
                              className='outline-none flex-1 h-[46px] py-3 px-3 border border-solid border-custom-accentColor rounded-[10px] flex justify-center items-center bg-white'
                              onClick={async (e)=>{
                                if(feesApproved && amountApproved){
      
                                  await handleSubmit();
                                                                
                                }
                                else{
                                  await notifyApproveFirst();
                                  
                                }
                            
                              }}
                            >
                              <h1 className='font-mont font-bold text-[12px] xl:text-sm text-custom-accentColor leading-6'>
                                Submit
                              </h1>
                            </button>
                            {/* <ToastContainer
                                    position="top-center"
                                    autoClose={4000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                  />   */}
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
            <LpManageLockedTabContent 
            title='Manage Lock Liquidity'
            handleFirstView={handleFirstView}
            firstView ={firstView} />
          </SaleLockTab>
        </div>
      </div>

      {lockOptionsModal && (
        <LockOptionsModal
          handleToggle={handleLockOptionsModal}
          activeLockOption={activeLockOption}
          handleLockOptions={handleLockOptions}

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
    // textAlign: 'right',
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
    fontSize: '14px',
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
    fontSize: '14px',
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
    height: 64,
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
  { label: '2 vesting period', value: '2 vesting period' },
  {
    label: '3 vesting period',
    value: '3 vesting period',
  },
  {
    label: '4 vesting period',
    value: '4 vesting period',
  },
];
