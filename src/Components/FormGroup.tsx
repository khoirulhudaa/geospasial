import axios from 'axios'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { formProps } from '../Models/componentInterface'
import store from '../Store/store'
import { useCoordinateFormik } from '../Validations/coordinateValidation'
import { useDinasFormik } from '../Validations/dinasValidation'
import { useSignInFormik } from '../Validations/signinValidation'
import { useSignUpFormik } from '../Validations/signupValidation'
import { useUpdateCoordinateFormik } from '../Validations/updateCoordinate'
import { useUpdateSubdistrictFormik } from '../Validations/updateSubdistrict'
import InputField from './InputField'
import ErrorMessage from './errorMessage'

const FormGroup: React.FC<formProps> = ({
    type,
    handleAlert,
    handleStatus,
    close,
    onClick,
    handleSign,
    titleID,
    handleDone,
    data,
    dataSubdistrict,
}) => {

    const [error, setError] = useState<string>('')
    const [check, setCheck] = useState<number>(0)
    const [inputValue, setInputValue] = useState<string>('')
    const [condition, setCondition] = useState<any[]>([])
    const [activeDanger, setActiveDanger] = useState<boolean>(false)
    const [borderError, setBorderError] = useState<boolean>(false)

    const dataConditionArea = [
        {
            label: 'Area hijau',
            icon: '🌲' 
        },
        {
            label: 'Pinggir kota',
            icon: '🏢' 
        },
        {
            label: 'Area industri',
            icon: '🏗️' 
        },
        {
            label: 'SPBU',
            icon: '⛽' 
        },
        {
            label: 'Dekat sekolah',
            icon: '🏫' 
        },
        {
            label: 'Dekat stasiun',
            icon: '🚃' 
        },
        {
            label: 'Pesisir/laut',
            icon: '⛱️' 
        },
        {
            label: 'Rumah sakit',
            icon: '🏥' 
        },
        {
            label: 'Area wisata',
            icon: '🏕️' 
        },
        {
            label: 'Tertutup',
            icon: '🧱' 
        },
        {
            label: 'Terblokir',
            icon: '🚧' 
        },
        {
            label: 'Jalur sepeda',
            icon: '🚲' 
        },
        {
            label: 'Bandara',
            icon: '🛩️' 
        },
        {
            label: 'Masjid',
            icon: '🕌' 
        },
        {
            label: 'Kawasan disabilitas',
            icon: '🦽' 
        },
        {
            label: 'Kantor polisi',
            icon: '🚓' 
        },
    ]

    const clearAllForm = () => {
        dinasFormik.resetForm()
        authFormiks.resetForm()
        authFormiks2.resetForm()
        coordinateFormik.resetForm()
    }

    const handleResponse = (response: number) => {
        if(response === 200) {
            clearAllForm()
            handleAlert('Berhasil perbarui data')
            handleStatus()
        }
    }

    const handleResponseCoordinate = (response: number) => {
        if(response === 200) {
            setCondition([])
            clearAllForm()
            handleDone()
            handleAlert()
        }
    }

    const handleResponseUP = () => {
        setError('')
        handleSign()
    }
    
    const handleErrorMessage = (error: string) => {
        setError(error)
        setCondition([])
    }
    
    const dinasFormik = useDinasFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse
    })
    
    const authFormiks = useSignInFormik({
        onError: handleErrorMessage
    })
    
    const authFormiks2 = useSignUpFormik({
        onError: handleErrorMessage,
        onResponse: handleResponseUP
    })

    const addCondition = (label: string, icon: string) => {
        const newData = {
            label,
            icon
        }
        const index = condition.findIndex(value => value.label === label);

        // If the condition is found, remove it
        if (index !== -1) {
            setCondition(prevCondition => prevCondition.filter(value => value.label !== label));
        } else {
            setCondition(prevCondition => [...prevCondition, newData]);
        }

        console.log('cond', condition)
    }
    
    const coordinateFormik = useCoordinateFormik({
        onError: handleErrorMessage,
        onResponse: handleResponseCoordinate,
        titleID,
        condition,
    })

    const debouncedCheckInputValue = debounce(checkInputValue, 2000);
   
    async function checkInputValue(value: any) {
        try {
            coordinateFormik.setFieldValue('name_location', value)
            const token = store.getState().Auth.token
            const response = await axios.post('http://localhost:3600/coordinate/check', {
                title_id: titleID,
                name_location: value
            }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log('check:', response.data.status);
            setCheck(response.data.status)
            if(response.data.status === 500) {
                handleStatus()
                setBorderError(true)
            }else {
                setBorderError(false)
            }
        } catch (error) {
            console.error('Error while fetching data:', error);
        }
    }

    // Event handler untuk memperbarui state nilai input
    const handleInputChange = (event: any) => {
        const value = event.target.value;
        setInputValue(value)
        coordinateFormik.setFieldValue('name_location', inputValue)
        
        debouncedCheckInputValue.cancel(); // Cancel previous debounce
        debouncedCheckInputValue(value); //  // Panggil fungsi debouncedCheckInputValue setiap kali input berubah
    };

    const updateSubFormik = useUpdateSubdistrictFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse,
        data
    })

    const updateCorFormik = useUpdateCoordinateFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse,
        data,
        condition,
        titleID
    })

    useEffect(() => {
        setCondition(prevCondition => [...prevCondition, ...updateCorFormik.values.condition ?? []]);
    }, [])

    const handleClick = () => {
        setError('')
        authFormiks.setValues({})
        authFormiks2.setValues({})
        onClick()
    }

    switch(type) {
        case "signup" :
            return (
                <form onSubmit={authFormiks2.handleSubmit} className='w-full'>
                    {
                        error !== '' ? (
                            <ErrorMessage error={error} />
                        ):
                            null
                    }
                    <div className='w-full mb-5'>
                        <InputField 
                            large={true}
                            name='email'
                            label='Email'
                            id='email'
                            placeholder='xxx@gmail.com'
                            value={authFormiks2.values.email}
                            onChange={authFormiks2.handleChange}
                            onBlur={authFormiks2.handleBlur}
                            onError={authFormiks2.errors.email}
                            onTouched={authFormiks2.touched.email}
                        />
                    </div>
                    <div className='w-full mb-5'>
                        <InputField 
                            large={true}
                            name='password'
                            id='password'
                            label='Password'
                            placeholder='xxx12xx'
                            value={authFormiks2.values.password}
                            onBlur={authFormiks2.handleBlur}
                            onChange={authFormiks2.handleChange}
                            onError={authFormiks2.errors.password}
                            onTouched={authFormiks2.touched.password}
                        />
                    </div>
                    <p className='my-8' onClick={() => handleClick()}>Sudah punya akun ? <span className='text-blue-500 cursor-pointer hover:text-blue-700 active:scale-[0.98]'>Masuk</span></p>
                    <button type='submit' className='w-full mt-12 text-center bg-slate-700 mr-6 border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center justify-center px-5 py-3 rounded-full text-[16px] text-white'>
                        <p>
                            Daftar sekarang
                        </p>
                    </button>
                </form>
            )
        case "coordinate":
            return (
                <form onSubmit={coordinateFormik.handleSubmit} className={`w-[60vw] h-max rounded-[20px] bg-white p-7 border ${borderError ? 'border-[3px] border-red-500' : 'border-slate-300'} `}>
                {
                    error !== '' ? (
                        <ErrorMessage error={error} />
                    ):
                        null
                }
                <div className='w-full flex h-max'>
                    <div className='w-full p-2 h-full'>
                        <div className='w-full mb-5 flex items-center justify-between'>
                            <div className='w-1/2 pr-6'>
                                <InputField 
                                    label='Nama lokasi/bangunan'
                                    name='name_location'
                                    id='name_location'
                                    iconLabel={
                                        check === 200 ? (
                                            <FaCheckCircle className='ml-2 text-green-500' />
                                        ): check === 500 ? (
                                            <FaTimesCircle className='ml-2 text-red-500' />
                                        ):
                                            null
                                    }
                                    value={inputValue}
                                    placeholder='Contoh: SMA di kabupaten cirebon'
                                    onChange={(e: any) => handleInputChange(e)}
                                    onBlur={coordinateFormik.handleBlur}
                                    onError={coordinateFormik.errors.name_location}
                                    onTouched={coordinateFormik.touched.name_location}
                                />
                            </div>
                            <div className='w-1/2'>
                                <InputField 
                                    label='Kecataman'
                                    name='subdistrict'
                                    type='select-input'
                                    options={dataSubdistrict}
                                    id='subdistrict'
                                    value={coordinateFormik.values.subdistrict}
                                    onChange={coordinateFormik.handleChange}
                                    onBlur={coordinateFormik.handleBlur}
                                    onError={coordinateFormik.errors.subdistrict}
                                    onTouched={coordinateFormik.touched.subdistrict}
                                />
                            </div>
                        </div>
                        <div className='w-full mb-5 flex items-center justify-between'>
                            <div className='w-1/2 pr-6'>
                                <InputField 
                                    label='Latitude'
                                    name='lat'
                                    type='number'
                                    id='latitude'
                                    value={coordinateFormik.values.lat}
                                    placeholder='-6123762'
                                    onChange={coordinateFormik.handleChange}
                                    onBlur={coordinateFormik.handleBlur}
                                    onError={coordinateFormik.errors.lat}
                                    onTouched={coordinateFormik.touched.lat}
                                />
                            </div>
                            <div className='w-1/2'>
                                <InputField 
                                    label='Longitude'
                                    name='long'
                                    id='longitude'
                                    type='number'
                                    value={coordinateFormik.values.long}
                                    placeholder='2009720'
                                    onChange={coordinateFormik.handleChange}
                                    onBlur={coordinateFormik.handleBlur}
                                    onError={coordinateFormik.errors.long}
                                    onTouched={coordinateFormik.touched.long}
                                />
                            </div>
                        </div>
                        <div className='w-full mb-5 flex items-center'>
                            <div className='w-1/2 pr-6'>
                                <InputField 
                                    label='Link google map (opsi)'
                                    name='link'
                                    id='link'
                                    value={coordinateFormik.values.link}
                                    placeholder='https://www.google.com/maps/...'
                                    onChange={coordinateFormik.handleChange}
                                    onBlur={coordinateFormik.handleBlur}
                                    onError={coordinateFormik.errors.link}
                                    onTouched={coordinateFormik.touched.link}
                                />
                            </div>
                            <div className='w-1/2 flex flex-col pl-[0.8px]'>
                                <label className='mt-1'>Rawan bencana ? </label>
                               <div className={`w-[40%] flec h-[45px] border mt-4 flex items-center border-slate-700 rounded-full px-2 duration-200 ${activeDanger ? 'bg-red-500' : 'bg-slate-200'}`}>
                                    <div onClick={() => {
                                            addCondition('Rawan bencana', '🛑')
                                            setActiveDanger(!activeDanger)
                                        }} 
                                        className={`w-[30px] flex items-center justify-center rounded-full h-[30px] ${activeDanger ? 'ml-auto' : 'ml-0'} bg-white duration-300 cursor-pointer active:scale-[0.98] hover:brightness-[98%]`}>
                                            <p className={`${activeDanger ? 'text-red-600 flex' : 'hidden'}`}>
                                                !
                                            </p>
                                    </div>
                               </div>
                            </div>
                        </div>
                        <h2 className='mt-8 text-[20px] font-bold'>Dekat area apakah ? (opsi)</h2>
                        <div className='w-full overflow-hidden flex-wrap h-max mt-5 flex items-center'>
                            <div className='w-max flex items-center overflow-x-auto'>
                                {
                                    dataConditionArea.map((data: any, index: number) => (
                                        <div key={index} onClick={() => addCondition(data.label, data.icon)} className={`cursor-pointer ${condition.some((dataCon: any) => dataCon.label === data.label) ? 'bg-green-200' : 'bg-white'} hover:bg-green-200 active:scale-[0.99] duration-100 w-max h-[40px] mr-4 mb-5 border border-black rounded-full px-2 py-1 text-center flex items-center justify-center`}>
                                            <p className='mr-3 w-max'>{data.label}</p>
                                            {data.icon}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        {/* <hr className='mb-4 mt-2 border-1 border-slate-700' /> */}
                    </div>
                </div>
                <div className='w-max flex items-center'>
                    <button type='submit' className='w-max hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-slate-700 text-white'>
                        <p>
                            Tambah koordinat
                        </p>
                    </button>
                    <button onClick={close} className='w-max ml-4 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-white border border-black text-black'>
                        <p>
                            Batalkan
                        </p>
                    </button>
                </div>
            </form>
            )
        case "update-subdistrict":
            return (
                <form onSubmit={updateSubFormik.handleSubmit}>
                    <div className='mb-5'>
                        <InputField 
                            label='Nama kecamatan'
                            name='name_subdistrict'
                            id='name_district'
                            value={updateSubFormik.values.name_subdistrict}
                            onChange={updateSubFormik.handleChange}
                            onBlur={updateSubFormik.handleBlur}
                            onTouched={updateSubFormik.touched.name_subdistrict}
                        />
                    </div>
                    <div className='mb-5'>
                        <InputField 
                            label='Latitide'
                            name='lat'
                            id='name_district'
                            value={updateSubFormik.values.lat}
                            onChange={updateSubFormik.handleChange}
                            onBlur={updateSubFormik.handleBlur}
                            onTouched={updateSubFormik.touched.lat}
                        />
                    </div>
                    <div className='mb-5'>
                        <InputField 
                            label='Longitude'
                            name='long'
                            id='name_district'
                            value={updateSubFormik.values.long}
                            onChange={updateSubFormik.handleChange}
                            onBlur={updateSubFormik.handleBlur}
                            onTouched={updateSubFormik.touched.long}
                        />
                    </div>
                    <div className='w-full flex items-center'>
                        <button type='submit' className='w-max mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-slate-700 text-white'>
                            <p>
                                Perbarui data
                            </p>
                        </button>
                        <button onClick={() => close()} className='w-max mt-5 ml-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] text-slate-700 border border-slate-700'>
                            <p>
                                Batalkan
                            </p>
                        </button>
                    </div>
                </form>
            )
        case "update-coordinate":
                return (
                    <form onSubmit={updateCorFormik.handleSubmit}>
                    {
                        error !== '' ? (
                            <ErrorMessage error={error} />
                        ):
                            null
                    }
                    <div className='w-full flex h-max'>
                        <div className='w-full p-2 h-full'>
                            <div className='w-full mb-5 flex flex-col items-center justify-between'>
                                <div className='w-full mb-5'>
                                    <InputField 
                                        label='Nama lokasi/bangunan'
                                        name='name_location'
                                        id='name_location'
                                        value={updateCorFormik.values.name_location}
                                        placeholder='Contoh: SMA di kabupaten cirebon'
                                        onChange={updateCorFormik.handleChange}
                                        onBlur={updateCorFormik.handleBlur}
                                        onError={updateCorFormik.errors.name_location}
                                        onTouched={updateCorFormik.touched.name_location}
                                    />
                                </div>
                                <div className='w-full'>
                                    <InputField 
                                        label='Kecataman'
                                        name='subdistrict'
                                        type='select-input'
                                        options={dataSubdistrict}
                                        id='subdistrict'
                                        value={updateCorFormik.values.subdistrict}
                                        placeholder='Contoh: Kedawung'
                                        onChange={updateCorFormik.handleChange}
                                        onBlur={updateCorFormik.handleBlur}
                                        onError={updateCorFormik.errors.subdistrict}
                                        onTouched={updateCorFormik.touched.subdistrict}
                                    />
                                </div>
                            </div>
                            <div className='w-full mb-5 flex flex-col items-center justify-between'>
                                <div className='w-full mb-5'>
                                    <InputField 
                                        label='Latitude'
                                        name='lat'
                                        id='latitude'
                                        value={updateCorFormik.values.lat}
                                        placeholder='-6123762'
                                        onChange={updateCorFormik.handleChange}
                                        onBlur={updateCorFormik.handleBlur}
                                        onError={updateCorFormik.errors.lat}
                                        onTouched={updateCorFormik.touched.lat}
                                    />
                                </div>
                                <div className='w-full'>
                                    <InputField 
                                        label='Longitude'
                                        name='long'
                                        id='longitude'
                                        value={updateCorFormik.values.long}
                                        placeholder='2009720'
                                        onChange={updateCorFormik.handleChange}
                                        onBlur={updateCorFormik.handleBlur}
                                        onError={updateCorFormik.errors.long}
                                        onTouched={updateCorFormik.touched.long}
                                    />
                                </div>
                            </div>
                            <div className='w-full mb-5 flex flex-col items-center'>
                                <div className='w-full mb-5'>
                                    <InputField 
                                        label='Link google map (opsi)'
                                        name='link'
                                        id='link'
                                        value={updateCorFormik.values.link}
                                        placeholder='-6123762'
                                        onChange={updateCorFormik.handleChange}
                                        onBlur={updateCorFormik.handleBlur}
                                        onError={updateCorFormik.errors.link}
                                        onTouched={updateCorFormik.touched.link}
                                    />
                                </div>
                                <div className='w-full'>
                                    <InputField 
                                        label='Catatan'
                                        name='note'
                                        id='note'
                                        value={updateCorFormik.values.note}
                                        placeholder='2009720'
                                        onChange={updateCorFormik.handleChange}
                                        onBlur={updateCorFormik.handleBlur}
                                        onError={updateCorFormik.errors.note}
                                        onTouched={updateCorFormik.touched.note}
                                    />
                                </div>
                            </div>
                            <h2 className='mt-8 text-[20px] font-bold'>Dekat area apakah ? (opsi)</h2>
                            <div className='w-full overflow-hidden flex-wrap h-max mt-5 flex items-center'>
                                <div className='w-max flex items-center overflow-x-auto'>
                                    {
                                        dataConditionArea.map((data: any, index: number) => {
                                            const isSelected2 = condition.some(dataCon => dataCon.label === data.label);
                                            return (
                                                <div key={index} onClick={() => addCondition(data.label, data.icon)} className={`cursor-pointer hover:bg-green-200 active:scale-[0.99] duration-100 w-max h-[40px] mr-4 mb-5 border ${isSelected2 ? 'border-green-500 bg-green-200' : 'border-black bg-transparent'} rounded-full px-2 py-1 text-center flex items-center justify-center`}>
                                                    <p className='mr-3 w-max'>{data.label}</p>
                                                    {data.icon}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-max flex items-center'>
                        <button type='submit' className='w-max hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-slate-700 text-white'>
                            <p>
                                Perbarui koordinat
                            </p>
                        </button>
                        <button onClick={close} className='w-max ml-4 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-white border border-black text-black'>
                            <p>
                                Batalkan
                            </p>
                        </button>
                    </div>
                </form>
            )
        default:
            return (
                <form onSubmit={authFormiks.handleSubmit} className='w-full'>
                    {
                        error !== '' ? (
                            <ErrorMessage error={error} />
                        ):
                            null
                    }
                    <div className='w-full mb-5'>
                        <InputField 
                            large={true}
                            name='email'
                            label='Email'
                            id='email'
                            placeholder='xxx@gmail.com'
                            value={authFormiks.values.email}
                            onChange={authFormiks.handleChange}
                            onBlur={authFormiks.handleBlur}
                            onError={authFormiks.errors.email}
                            onTouched={authFormiks.touched.email}
                        />
                    </div>
                    <div className='w-full mb-5'>
                        <InputField 
                            large={true}
                            name='password'
                            id='password'
                            label='Password'
                            placeholder='xxx12xx'
                            value={authFormiks.values.password}
                            onChange={authFormiks.handleChange}
                            onBlur={authFormiks.handleBlur}
                            onError={authFormiks.errors.password}
                            onTouched={authFormiks.touched.password}
                        />
                    </div>
                    <button type='submit' className='w-full mt-12 text-center bg-slate-700 mr-6 border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center justify-center px-5 py-3 rounded-full text-[16px] text-white'>
                        <p>
                            Masuk sekarang
                        </p>
                    </button>
                </form>
            )
    }
}

export default FormGroup
