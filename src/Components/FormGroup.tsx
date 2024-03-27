import axios from 'axios'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ChromePicker } from 'react-color'
import { FaCheckCircle, FaFileExcel, FaHandPointer, FaSpinner, FaTimes, FaTimesCircle, FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import * as XLSX from 'xlsx'
import { formProps } from '../Models/componentInterface'
import { removeCoordinateById } from '../Store/coordinateSlice'
import store from '../Store/store'
import { useCoordinateFormik } from '../Validations/coordinateValidation'
import { useCustomExcelCoordinateFormik } from '../Validations/createCoordinateExcelPolygon'
import { useCustomCoordinateFormik } from '../Validations/createCoordinateValidation'
import { useDinasFormik } from '../Validations/dinasValidation'
import { useSignInFormik } from '../Validations/signinValidation'
import { useSignUpFormik } from '../Validations/signupValidation'
import { useUpdateCoordinateFormik } from '../Validations/updateCoordinate'
import { useUpdateSubdistrictFormik } from '../Validations/updateSubdistrict'
import InputField from './InputField'
import SweetAlert from './SweetAlert'
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
    swipe,
    changeColor,
    uploadExcel
}) => {

    const coordinates = useSelector((state: any) => state.Coordinate?.coordinate)
    console.log('coor nbew:', coordinates)

    const dispatch = useDispatch()

    const [error, setError] = useState<string>('')
    const [check, setCheck] = useState<number>(0)
    const [inputValue, setInputValue] = useState<string>('')
    const [condition, setCondition] = useState<any[]>([])
    const [activeDanger, setActiveDanger] = useState<boolean>(false)
    const [borderError, setBorderError] = useState<boolean>(false)
    const [selectColor, setSelectColor] = useState<string>('')
    const [danger, setDanger] = useState<boolean>(false)
    const [showTrash, setShowTrash] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [nowIndex, setNowIndex] = useState<number>(999999999);
    const [nameFile, setNameFile] = useState<string>('')
    const [dataPolygonExcel, setDataPolygonExcel] = useState<any>(null);

    console.log(nameFile)

    const handleMouseEnter = (index: number) => {
      setShowTrash(true);
      setNowIndex(index)
    };
    
    const handleMouseLeave = () => {
        setShowTrash(false);
        setNowIndex(999999999)
    };

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
        setNameFile('')
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
   
    const handleResponseCustom = (response: number) => {
        if(response === 200) {
            clearAllForm()
            setNameFile('')
            handleAlert('Berhasil tambah data')
            handleStatus()
        }
    }

    const handleResponseCoordinate = (response: number) => {
        if(response === 200) {
            setCondition([])
            clearAllForm()
            handleAlert()
            handleDone()
            swipe()
        }
    }

    const handleResponseUP = () => {
        setError('')
        handleSign()
    }
    
    const handleErrorMessage = (error: string) => {
        setError(error)
        setLoading(false)
        setCondition([])
    }

    const handleResponseAuth = () => {
        setLoading(false)
    }
    
    const dinasFormik = useDinasFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse
    })
    
    const authFormiks = useSignInFormik({
        onError: handleErrorMessage,
        onResponse: handleResponseAuth
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

    const dataDanger = [
        {label: 'Pilih jenis kerawan', value: ''},
        {label: 'Banjir', value: 'Banjir'},
        {label: 'Longsor', value: 'Longsor'},
        {label: 'Abu vulkanik', value: 'Abu vulkanik'},
        {label: 'Badai', value: 'Badai'},
        {label: 'Petir', value: 'Petir'},
        {label: 'Kekeringan', value: 'Kekeringan'},
        {label: 'Wabah', value: 'Wabah'},
        {label: 'Kriminalitas', value: 'Kriminalitas'},
        {label: 'Tawuran', value: 'Tawuran'},
        {label: 'Pencurian', value: 'Pencurian'},
        {label: 'Kecelakaan', value: 'Kecelakaan'},
        {label: 'Hewan buas', value: 'Hewan buas'},
        {label: 'Kebakarans', value: 'Kebakarans'}
    ]

    const dataArea = [
        {label: 'Pilih jenis wilayah', value: ''},
        {label: 'Kabupaten', value: 'Banjir'},
        {label: 'Kota', value: 'Longsor'},
        {label: 'Gabungan', value: 'Abu vulkanik'},
    ]

    const dataWide = [
        {label: 'Pilih satuan', value: ''},
        {label: 'KM', value: 'km'},
        {label: 'CM', value: 'cm'},
        {label: 'MM', value: 'mm'},
        {label: 'ft', value: 'ft'},
        {label: 'Yeard', value: 'yd'},
    ]

    const hanleFinallyRemoveCoordinate = (number: number) => {
        dispatch(removeCoordinateById(number))
    }

    const handleRemoveCoordinate = (number: number) => {
        SweetAlert({
            text: `Yakin hapus koordinat (${number + 1}) ?`,
            icon: 'question',
            onClick: () => hanleFinallyRemoveCoordinate(number)
        })
    }

    const createCustomCoordinate = useCustomCoordinateFormik({
        onError: handleErrorMessage,
        onResponse: handleResponseCustom,
        color: selectColor,
        titleID,
        danger
    })

    const createCustomCoordinateWithExcel =  useCustomExcelCoordinateFormik({
        onError: handleErrorMessage,
        onResponse: handleResponseCustom,
        dataPolygonExcel,
        titleID
    })


    const handleFileUploadPolygon = (e: any) => {
        console.log(e)
        const file = e.target.files[0];
        setNameFile(file.name)
        const reader = new FileReader();
            
        reader.onload = (event: any) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
    
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
    
        const data: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const findFieldIndex = (fieldOptions: string[]) => {
        for (let i = 0; i < data[0].length; i++) {
            const field = data[0][i].toLowerCase();
            if (fieldOptions.some(option => field.includes(option.toLowerCase()))) {
            return i;
            }
        }
        return -1; 
        };
        
        // Mengonversi data Excel menjadi array of objects dengan property name_location, lat, dan long
        const nameIndex = findFieldIndex(["Nama lokasi", "nama lokasi", "lokasi", "nama", "Nama", "NAMA", "name", "Name", "NAME", "Daftar data", 'daftar data", "nama", "Daftar Data", "Nama data', "Data", "NAMA LOKASI", "LOKASI", "DAFTAR DATA", "NAMA DATA", "Daftar_data", "Nama _lokasi"]);
        const typeDangerExcel = findFieldIndex(["Jenis Rawan", "Jenis Rawan" , "jenis_rawan", "jenis rawan", "JENIS_RAWAN", "Jenis Rawan", "JENIS RAWAN"]);
        const typeAreaExcel = findFieldIndex(["jenis area", "jenis_area", "Jenis_area", "Jenis Area", "JENIS AREA", "JENIS_AREA"]);
        const colorExcel = findFieldIndex(["Warna", "warna", "WARNA"]);
        const descriptionExcel = findFieldIndex(["Deskripsi", "deskripsi", "DESKRIPSI"]);
        const wideExcel = findFieldIndex(["Luas", "luas", "LUAS", "luas_area", "Luas_area", "luas area"]);
        const typeWideExcel = findFieldIndex(["satuan", "Satuan", "SATUAN"]);
        const coordinatesIndex = findFieldIndex(["Koordinat", "koordinat", "kordinat", "Kordinat", "KOORDINAT"]);
    
        const convertedData: any = data.slice(1).map((row: any) => {
            const coordinatesString = row[coordinatesIndex]; // Ambil nilai koordinat dalam format string JSON dari row
            const coordinates = JSON.parse(coordinatesString); 
        
            console.log('result excel polygon coordinates:', coordinates)

            return {
                name: nameIndex !== -1 ? row[nameIndex] : '-',
                type_danger: typeDangerExcel !== -1 ? row[typeDangerExcel] : '-',
                type_area: typeAreaExcel !== -1 ? row[typeAreaExcel] : '-',
                color: colorExcel !== -1 ? row[colorExcel] : '-',
                description: descriptionExcel !== -1 ? row[descriptionExcel] : '-',
                wide: wideExcel !== -1 ? row[wideExcel] : '-',
                typeWide: typeWideExcel !== -1 ? row[typeWideExcel] : 0,
                coordinates: Array.isArray(coordinates) ? coordinates.map(coord => [parseFloat(coord[0]), parseFloat(coord[1])]) : [],
            };
        }).filter((obj: any) =>
            obj.name !== '' &&
            obj.type_danger !== '' &&
            obj.type_area !== '' &&
            obj.color !== '' &&
            obj.description !== '' &&
            obj.wide !== '' &&
            obj.typeWide !== ''
        );

        // Menyimpan data yang sudah dikonversi
        console.log('this is excel data:', data);
        console.log('new data from excel:', convertedData);
        setDataPolygonExcel(convertedData);
    
        };
    
        reader.readAsBinaryString(file);
        };
    

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
                <form onSubmit={coordinateFormik.handleSubmit} className={`w-[80vw] h-max rounded-[20px] bg-white p-7 border ${borderError ? 'border-[3px] border-red-500' : 'border-slate-300'} `}>
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
                        <div className='w-full mt-8 justify-between mb-5 flex items-center'>
                            <div className='w-[30%]'>
                                <InputField 
                                    label='Link google map'
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
                            <div className='w-[30%]'>
                                <InputField 
                                    label='Link Thumbnail (Google map)'
                                    name='thumbnail'
                                    id='thumbnail'
                                    value={coordinateFormik.values.thumbnail}
                                    placeholder='https://www.google.com/maps/...'
                                    onChange={coordinateFormik.handleChange}
                                    onBlur={coordinateFormik.handleBlur}
                                    onError={coordinateFormik.errors.thumbnail}
                                    onTouched={coordinateFormik.touched.thumbnail}
                                />
                            </div>
                            <div className='w-[30%] flex flex-col pl-[0.8px]'>
                                <label className='font-[500] text-[14px]'>Rawan bencana ? </label>
                                <div className={`w-full flec h-[45px] border mt-4 flex items-center border-slate-700 rounded-full px-2 duration-200 ${activeDanger ? 'bg-red-500' : 'bg-slate-200'}`}>
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
        case "custom-coordinate-excel": 
            return (
                <div className='relative w-full bg-white rounded-[12px] flex-col flex justify-center items-center px-5 py-12 h-max'>
                    <div onClick={() => uploadExcel()} className='absolute top-5 right-5 w-[34px] h-[34px] rounded-full bg-green-500 text-white flex items-center justify-center cursor-pointer hover:brightness-[90%] active:scale-[0.98]'>
                        <FaHandPointer />
                    </div>
                    {
                        nameFile !== '' ? (
                            <form onSubmit={createCustomCoordinateWithExcel.handleSubmit} className='mt-6 bg-slate-100 h-max py-6 rounded-[12px] w-full'>
                                <div className='relative w-full h-max overflow-ellipsis whitespace-nowrap text-center flex flex-col items-center justify-center'>
                                    <FaFileExcel className='text-[30px] mb-4' />
                                    <div className='w-max h-max px-3 py-2 rounded-full flex items-center justify-center bg-white'>
                                        {nameFile}
                                    </div>
                                    <div onClick={() => {setNameFile(''), setDataPolygonExcel([])}} className='w-max h-max mt-4 px-4 py-2 rounded-full flex items-center justify-center bg-red-500 text-white'>
                                        <FaTimes className='text-white' />
                                        <p className='ml-3'>Hapus File</p>
                                    </div>
                                    <button type='submit' className='w-[80%] mt-5 text-center bg-slate-700 border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center justify-center px-4 py-2 rounded-full text-[16px] text-white'>
                                        <p>
                                            Simpan
                                        </p>
                                    </button>
                                </div>
                            </form>
                        ):
                        <div className='w-full mb-4'>
                            <div className='relativ mt-6 bg-slate-100 h-max py-14 rounded-[12px] w-full mx-auto text-center flex flex-col items-center justify-center'>
                                <FaFileExcel className='text-[30px]' />
                                <p className='mt-8'>Tambahkan file excel</p>
                            </div>
                            <input accept=".xlsx, .xls" type="file" name='excel' onChange={(e: any) => handleFileUploadPolygon(e)} className='w-full bg-white cursor-pointer opacity-0 z-40 h-[30%] scale-[10]' />
                        </div>
                    }
                    <hr className='border-t border-t-slate-300 border-[1px] mb-5 w-full' />
                    <div className='w-full mb-5'>
                        <div className='w-full flex items-center'>
                            <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>nama/nama lokasi</div>
                            <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                        </div>
                        <small>Nama area polygon</small>
                    </div>
                    <div className='w-full mb-5'>
                        <div className='w-full flex items-center'>
                            <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>jenis area</div>
                            <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                        </div>
                        <small>Kabupaten/Kota/Gabungan</small>
                    </div>
                    <div className='w-full mb-5'>
                        <div className='w-full flex items-center'>
                            <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>jenis rawan</div>
                            <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                        </div>
                        <small>Kerawan yang sering terjadi</small>
                    </div>
                    <div className='w-full mb-5'>
                        <div className='w-full flex items-center'>
                            <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>warna</div>
                            <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                        </div>
                        <small>Warna untuk polygon</small>
                    </div>
                    <div className='w-full mb-5'>
                        <div className='w-full flex items-center'>
                            <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>deskripsi</div>
                            <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                        </div>
                        <small>Keterangan singkat terkait area</small>
                    </div>
                    <div className='w-full mb-5'>
                        <div className='w-full flex items-center'>
                            <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>luas</div>
                            <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                        </div>
                        <small>Luas area dalam polygon</small>
                    </div>
                    <div className='w-full mb-5'>
                        <div className='w-full flex items-center'>
                            <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>satuan</div>
                            <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                        </div>
                        <small>KM/Hektart/Yarn/dll</small>
                    </div>
                    <div className='w-full mb-5'>
                        <div className='w-full flex items-center'>
                            <div className='bg-green-200 text-green-500 rounded-lg w-max h-max px-3 py-1'>koordinat</div>
                            <div className='ml-2 bg-red-200 text-red-500 rounded-lg w-max h-max px-2 text-[12px] py-1'>wajib</div>
                        </div>
                        <small>Semua data <b>lat</b> dan <b>long</b></small>
                    </div>
                </div>
            )
        case "custom-coordinate":
            return (
                <form onSubmit={createCustomCoordinate.handleSubmit} className='w-full bg-white rounded-[12px] px-5 pb-4 py-5 h-max'>
                    <div className='w-full border-b border-slate-300 pb-4 flex items-center justify-between'>
                        <label className='font-[500] text-[14px] text-slate-800'>Titik koordinat</label>
                        <div onClick={() => uploadExcel()} className='w-[34px] h-[34px] rounded-full bg-green-500 text-white flex items-center justify-center cursor-pointer hover:brightness-[90%] active:scale-[0.98]'>
                            <FaFileExcel />
                        </div>
                    </div>
                    <div className='my-5 h-max border-b border-black pb-3 w-full'>
                    <div className='w-full overflow-x-auto flex flex-wrap items-center'>
                        {
                            coordinates && coordinates.length > 0 ? (
                                coordinates?.map((data: any, index: number) => (
                                    <div 
                                        key={index} 
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave} 
                                        title={`lat: ${data[0]} & lng: ${data[1]}`} 
                                        onClick={() => handleRemoveCoordinate(index)} 
                                        className='w-[40px] h-[40px] cursor-pointer hover:bg-red-500 active:scale-[0.97] duration-100 rounded-full bg-blue-500 text-white mr-3 mb-3 flex justify-center items-center'
                                    >
                                        {
                                            showTrash && nowIndex === index ? (
                                                <FaTrashAlt />
                                            ):
                                                `${index + 1}`
                                        }
                                    </div>
                                ))
                            ):
                                <div className='w-[40px] h-[40px] rounded-full bg-slate-300 text-slate-500 mr-3 mb-3 flex justify-center items-center'>0</div>
                        }
                    </div>
                    </div>
                    <div className='mb-5'>
                        <InputField 
                            name='name'
                            label='Nama'
                            value={createCustomCoordinate.values.name}
                            onChange={createCustomCoordinate.handleChange}
                            onBlur={createCustomCoordinate.handleBlur}
                            onTouched={createCustomCoordinate.touched.name}
                            onError={createCustomCoordinate.errors.name}
                            placeholder='Masukan nama'
                        />
                    </div>
                    <div className='mb-4 border-t border-black'></div>
                    <div className='mb-5'>
                        <InputField 
                            name='wide'
                            type='number'
                            label='Luas wilayah (opsi)'
                            value={createCustomCoordinate.values.wide}
                            onChange={createCustomCoordinate.handleChange}
                            onBlur={createCustomCoordinate.handleBlur}
                            onTouched={createCustomCoordinate.touched.wide}
                            onError={createCustomCoordinate.errors.wide}
                            placeholder='Masukan luas'
                        />
                    </div>
                    {
                        createCustomCoordinate.values.wide ? (
                            <div className='mb-5'>
                                <InputField 
                                    name='typeWide'
                                    label='Satuan'
                                    large
                                    type='select-input'
                                    options={dataWide}
                                    value={createCustomCoordinate.values.typeWide}
                                    onChange={createCustomCoordinate.handleChange}
                                    onBlur={createCustomCoordinate.handleBlur}
                                    onTouched={createCustomCoordinate.touched.typeWide}
                                    onError={createCustomCoordinate.errors.typeWide}
                                />
                            </div>
                        ):
                            null
                    }
                    <div className='mb-5 border-t pb-6 pt-3 border-b border-black'>
                    <label className='font-[500] text-[14px] text-slate-800 mb-4'>Warna polygon</label>
                    <div className='mb-4' />
                    <ChromePicker 
                        color={selectColor}
                        onChange={(e: any) => {setSelectColor(e), changeColor(e?.hex)}}
                    />
                    </div>
                    <div className='mb-5'>
                    <label className='font-[500] text-[14px] text-slate-800 mt-1'>Wilayah rawan ? </label>
                    <div className={`w-[40%] flec h-[45px] border mt-4 flex items-center border-slate-700 rounded-full px-2 duration-200 ${danger ? 'bg-red-500' : 'bg-slate-200'}`}>
                        <div onClick={() => setDanger(!danger)} 
                            className={`w-[30px] flex items-center justify-center rounded-full h-[30px] ${danger ? 'ml-auto' : 'ml-0'} bg-white duration-300 cursor-pointer active:scale-[0.98] hover:brightness-[98%]`}>
                                <p className={`${danger ? 'text-red-600 flex' : 'hidden'}`}>
                                    !
                                </p>
                        </div>
                    </div>
                    </div>
                    {
                    danger ? (
                        <div className='mb-5'>
                            <InputField 
                                name='type_danger'
                                label='Jenis kerawanan'
                                large
                                type='select-input'
                                options={dataDanger}
                                value={createCustomCoordinate.values.type_danger}
                                onChange={createCustomCoordinate.handleChange}
                                onBlur={createCustomCoordinate.handleBlur}
                                onTouched={createCustomCoordinate.touched.type_danger}
                                onError={createCustomCoordinate.errors.type_danger}
                            />
                        </div>
                    ):
                        null
                    }
                    <div className='mb-5'>
                        <InputField 
                            name='type_area'
                            label='Wilayah'
                            large
                            type='select-input'
                            options={dataArea}
                            value={createCustomCoordinate.values.type_area}
                            onChange={createCustomCoordinate.handleChange}
                            onBlur={createCustomCoordinate.handleBlur}
                            onTouched={createCustomCoordinate.touched.type_area}
                            onError={createCustomCoordinate.errors.type_area}
                        />
                    </div>
                    <div className='mb-5'>
                        <InputField 
                            name='description'
                            label='Deskripsi'
                            type='textarea-input'
                            value={createCustomCoordinate.values.description}
                            onChange={createCustomCoordinate.handleChange}
                            onBlur={createCustomCoordinate.handleBlur}
                            onTouched={createCustomCoordinate.touched.description}
                            onError={createCustomCoordinate.errors.description}
                            placeholder='Masukan deskripsi'
                        />
                    </div>
                    <div className='w-full flex items-center mb-3'>
                        <button type='submit' className='w-full mt-12 text-center bg-slate-700 mr-6 border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center justify-center px-5 py-3 rounded-full text-[16px] text-white'>
                            <p>
                                Simpan
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
                    <button type='submit' onClick={authFormiks.values.password !== '' ? () => setLoading(true) : () => null} className='w-full mt-12 text-center flex items-center bg-slate-700 mr-6 border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center justify-center px-5 py-3 rounded-full text-[16px] text-white'>
                       {
                        loading ? (
                            <FaSpinner className='mr-2 animate-spin' />
                        ):
                            null
                       }
                        <p>
                            Masuk sekarang
                        </p>
                    </button>
                </form>
            )
    }
}

export default FormGroup
