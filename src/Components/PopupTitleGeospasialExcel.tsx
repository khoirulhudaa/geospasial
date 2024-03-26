import React, { useState } from 'react'
import { FaFileExcel, FaTimes } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import { popUpProps } from '../Models/componentInterface'
import { useTitleFormik } from '../Validations/titleValidation'
import InputField from './InputField'
import ErrorMessage from './errorMessage'

const PopupTitleGeospasialExcel: React.FC<popUpProps> = ({
    handleAlert,
    close,
    dinasID,
    dinasNAME,
    handleStatus
}) => {

    const [error, setError] = useState<string>('')
    const [errorExcel, setErrorExcel] = useState<string>('')
    const [excelData, setExcelData] = useState<any>([]);
    const [nameFile, setNameFile] = useState<string>('')
    const [activeUploadExcel, setActiveUploadExcel] = useState<boolean>(false)

    const handleErrorMessage = (error: string) => {
        setError(error)
        setErrorExcel(error)
    }

    const handleResponse = (response: number) => {
        if(response === 200) {
            handleStatus()
            handleAlert()
        }
    }

    const titleFormik = useTitleFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse,
        dinasID,
        dinasNAME,
        ...(excelData !== null && excelData?.length > 0 ? { excelData } : {})
    });

    const handleFileUpload = (e: any) => {

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
    const nameIndex = findFieldIndex(["Nama lokasi", "nama lokasi", "lokasi", "Daftar data", 'daftar data", "nama", "Daftar Data", "Nama data', "Data", "NAMA LOKASI", "LOKASI", "DAFTAR DATA", "NAMA DATA", "Daftar_data", "Nama _lokasi"]);
    const latIndex = findFieldIndex(["Latitude", "latitude", "lat", "Lat", "LAT", "LATITUDE"]);
    const longIndex = findFieldIndex(["Longitude", "longitude", "long", "Long", "lng", "LONG", "LONGITUDE", "Longitudinal", "LONGITUDINAL"]);
    const linkMap = findFieldIndex(["link", "url", "link", "Url", "LINK", "LING", "URL"]);
    const linkThumbnail = findFieldIndex(["foto", "thumbnail", "gambar", "Foto", "Thumbnail", "Gambar", "FOTO", "THUMBNAIL", "GAMBAR"]);
    const subdistrictExcel = findFieldIndex(["Kecamatan", "kecamatan", "KECAMATAN", "kcmtn", "KCMTN"]);

    data.slice(1).map((row: any) => {console.log(row)})

    // Mengambil data sesuai dengan indeks yang telah ditemukan
    const convertedData: any = data.slice(1).map((row: any) => ({
        name_location: nameIndex !== -1 ? row[nameIndex] : '-',
        lat: latIndex !== -1 ? row[latIndex] : 0,
        long: longIndex !== -1 ? row[longIndex] : 0,
        link: linkMap !== -1 ? row[linkMap] : '-',
        subdistrict: subdistrictExcel !== -1 ? row[subdistrictExcel] : '-',
        thumbnail: linkThumbnail !== -1 ? row[linkThumbnail] : '-',
    })).filter((obj: any) =>
        obj.name_location !== '' &&
        obj.lat !== '' &&
        obj.long !== '' &&
        obj.subdistrict !== '' &&
        obj.link !== '' &&
        obj.thumbnail !== '' &&
        obj.name_location !== undefined &&
        obj.lat !== undefined &&
        obj.long !== undefined &&
        obj.subdistrict !== undefined &&
        obj.link !== undefined &&
        obj.thumbnail !== undefined
    );
    

    // Menyimpan data yang sudah dikonversi
    console.log('this is excel data:', data);
    console.log('new data from excel:', convertedData);
    setExcelData(convertedData);
    setActiveUploadExcel(!activeUploadExcel);

    };

    reader.readAsBinaryString(file);
};

  return (
    <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700    bg-opacity-[0.7]'>
        <form onSubmit={titleFormik.handleSubmit} className='w-[40vw] h-max rounded-[20px] bg-white p-7'>
            {
                error !== '' ? (
                    <ErrorMessage error={error} />
                ):
                    null
            }
            <div className='mb-5'>
                <InputField 
                    label='Judul data geospasial'
                    name='title'
                    id='title'
                    value={titleFormik.values.title}
                    onChange={titleFormik.handleChange}
                    onBlur={titleFormik.handleBlur}
                    onError={titleFormik.errors.title}
                    onTouched={titleFormik.touched.title}
                />
            </div>
            <div className='mb-5'>
                <InputField 
                    label='Tahun'
                    name='year'
                    id='year'
                    value={titleFormik.values.year}
                    onChange={titleFormik.handleChange}
                    onBlur={titleFormik.handleBlur}
                    onError={titleFormik.errors.year}
                    onTouched={titleFormik.touched.year}
                />
            </div>
            <div className='mb-5 w-full pt-4 pb-5'>
                <label htmlFor="status" className='text-[14px] font-bold text-slate-800'>Status Data</label>
                <div role="group" id='status' aria-labelledby="my-radio-group" className="w-max mt-5 flex items-center space-x-2">
                    <label className="inline-flex items-center">
                        <input type="radio" name="status" value="Sementara" onChange={(e: any) => titleFormik.setFieldValue('status', e.target.value)} className="form-radio h-6 w-6"/>
                        <span className="ml-2">Sementara</span>
                    </label>
                    <div className='w-[20px]'></div>
                    <label className="inline-flex items-center">
                        <input type="radio" name="status" value="Tetap" onChange={(e: any) => titleFormik.setFieldValue('status', e.target.value)} className="form-radio h-6 w-6"/>
                        <span className="ml-2">Tetap</span>
                    </label>
                </div>
            </div>
            <div className='mb-5'>
                <InputField 
                    label='Deskripsi Singkat'
                    name='description'
                    id='description'
                    value={titleFormik.values.description}
                    onChange={titleFormik.handleChange}
                    onBlur={titleFormik.handleBlur}
                    onError={titleFormik.errors.description}
                    onTouched={titleFormik.touched.description}
                />
            </div>
            <div className='w-max flex items-center'>
                <button type='submit' className='w-max mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-slate-700     text-white'>
                    <p>
                        Tambah judul
                    </p>
                </button>
                <button onClick={close} className='w-max ml-4 mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-white border border-black text-black'>
                    <p>
                        Batalkan
                    </p>
                </button>
            </div>
        </form>
        <div className='w-[30vw] h-[55vh] rounded-tr-[20px] rounded-br-[20px] bg-white py-7 pr-7 pl-4'>
            <div className='relative w-full h-full border border-slate-700 rounded-[20px] flex flex-col justify-center items-center text-center'>
                <div className='absolute overflow-hidden rounded-[20px] active:scale-[0.98] w-full flex-col h-full bg-white cursor-pointer hover:brightness-[94%] flex justify-center items-center'>
                    {
                        nameFile !== '' ? (
                            <div className='absolute w-[90%] overflow-ellipsis whitespace-nowrap text-center flex flex-col items-center'>
                                {
                                    errorExcel !== '' ? (
                                        <>
                                            <p className='w-max h-max text-[12px] mt-1 px-4 relative bottom-6 py-2 rounded-full flex items-center justify-center bg-red-500 text-white'>{errorExcel}</p>
                                            <div className='absolute mt-4 text-center flex flex-col items-center'>
                                                <FaFileExcel className='text-[30px]' />
                                                <p className='mt-4'>Tambahkan file excel</p>
                                            </div>
                                            <input accept=".xlsx, .xls" type="file" name='excel' onChange={(e: any) => handleFileUpload(e)} className='w-full bg-white cursor-pointer opacity-0 ml-24 mt-4 z-40 scale-[10]' />
                                        </>
                                    ):
                                    <>
                                        <FaFileExcel className='text-[30px] mb-4' />
                                        <div className='w-max h-max px-3 py-2 rounded-full flex items-center justify-center bg-white'>
                                            {nameFile}
                                        </div>
                                        <div onClick={() => {setNameFile(''), setExcelData([])}} className='w-max h-max mt-1 px-4 py-2 rounded-full flex items-center justify-center bg-red-500 text-white'>
                                            <FaTimes className='text-white' />
                                            <p className='ml-3'>Hapus File</p>
                                        </div>
                                    </>
                                }
                            </div>
                        ):
                        <>
                            <div className='absolute text-center flex flex-col items-center'>
                                <FaFileExcel className='text-[30px]' />
                                <p className='mt-8'>Tambahkan file excel</p>
                            </div>
                            <input accept=".xlsx, .xls" type="file" name='excel' onChange={(e: any) => handleFileUpload(e)} className='w-full bg-white cursor-pointer opacity-0 z-40 h-[30%] scale-[10]' />
                        </>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default PopupTitleGeospasialExcel
