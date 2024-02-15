import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import FormGroup from '../Components/FormGroup'
import { authSignOut } from '../Store/authSlice'
import { Diskominfo, EarthPNG } from '../assets'
import '../index.css'

const Login: React.FC = () => {

    const [active, setActive] = useState<boolean>(false)
    const [daftar, setDaftar] = useState<boolean>(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(authSignOut())
    }, [])

    const handleSign = () => {
        setDaftar(false)
    }

  return (
    <div className='min-h-screen flex bg-white'>
         <div className='relative w-[33vw] h-screen flex justify-center items-center'>
            <div onClick={() => setDaftar(true)} className='opacity-0 w-max h-max flex items-center justify-center bg-green-200 fixed z-40 top-4 right-5 cursor-pointer'>Daftar</div>
            <div className='relative absolute px-8 pb-8 pt-5 right-0 w-[88%] h-max rounded-[20px] border-2 border-slate-700'>
                <div className='w-full flex items-center justify-between mb-8'>
                    <img src={Diskominfo} className='w-[40%] ml-[-7px]' alt="logo-diskominfo" />
                    <div onClick={() => setActive(!active)} className='relative cursor-pointer active:scale-[0.99] duration w-[24px] h-[24px] border border-black rounded-full flex items-center justify-center'>
                        <p>
                            !
                        </p>
                        {
                            active ? (
                                <div className='w-max text-[12px] absolute duration-200 top-7 px-2 py-1 rounded-full text-center bg-white text-black border border-black'>
                                    <p className='w-max'>
                                        Akses khusus pegawai diskominfo
                                    </p>
                                </div>
                            ):
                                null
                        }
                    </div>
                </div>
                <h2 className='text-[30px] font-bold mb-4'>{daftar ? 'Daftar' : 'Masuk'}</h2>
                <hr className='mb-5' />
                <FormGroup handleSign={() => handleSign()} type={`${daftar ? 'signup' : 'default'}`} onClick={() => setDaftar(false)} />
            </div>
        </div>
        <div className='relative overflow-hidden w-[67vw] h-screen bg-slate-700 border-r border-r-slate-700'>
            <img src={EarthPNG} alt="side-bg" id='earth' className='absolute scale-[1.8] z-[1] left-[-30px] bottom-[-20%] opacity-[0.6]' />    
            <div className='relative w-full flex items-center justify-center h-screen p-8 bg-black z-[333] bg-opacity-[0.4]'>
               <h1 className='text-white text-[62px]'>Cirebon</h1>
            </div>
        </div>
    </div>
  )
}

export default Login
