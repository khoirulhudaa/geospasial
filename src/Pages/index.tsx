import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { FaFileExcel, FaFilePdf, FaPenAlt, FaPlus, FaSignOutAlt, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Map, PopupService, Subdistrict } from '../Components';
import FormGroup from '../Components/FormGroup';
import Grafik from '../Components/Grafik';
import PopupSubdistrict from '../Components/PopSubdistrict';
import PopupKoordinat from '../Components/PopupKoordinat';
import PopupTitleGeospasial from '../Components/PopupTitleGeospasial';
import PopupUpdateService from '../Components/PopupUpdateService';
import SweetAlert from '../Components/SweetAlert';
import convertArrayOfObjectsToArray from '../Helpers/arrayTwoDimention';
import API from '../Services/service';
import store from '../Store/store';
import { Device, EarthPNG, Success } from '../assets';

const Homepage: React.FC = () => {

  const navigate = useNavigate()
  
  // Boolean
  const [addService, setAddService] = useState<boolean>(false)
  const [alert, setAlert] = useState<boolean>(false)
  const [addGeospasial, setAddGeospasial] = useState<boolean>(false)
  const [addKoordinat, setAddKoordinat] = useState<boolean>(false)
  const [addSubdistrict, setAddSubdistrict] = useState<boolean>(false)
  const [line] = useState<boolean>(false)
  const [status, setStatus] = useState<boolean>(false)
  const [activeHeight, setActiveHeight] = useState<boolean>(false)
  const [activeWidth, setActiveWidth] = useState<boolean>(false)
  const [activeSidebarUpdateSub, setActiveSidebarUpdateSub] = useState<boolean>(false)
  const [showAll, setShowAll] = useState<boolean>(false)
  const [updateDinas, setUpdateDinas] = useState<boolean>(false)

  // String
  const [activeUpdate, setActiveUpdate] = useState<string>('')
  const [activePage, setActivePage] = useState<string>('')
  const [dinasID, setDinasID] = useState<string>('')
  const [titleID, setTitleID] = useState<string>('')
  const [selectNameSub, setSelectNameSub] = useState<string>('')
  const [subdistrictID, setSubdistrictID] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [searchTitle, setSearchTitle] = useState<string>('')
  const [lat, setLat] = useState<string>('')
  const [long, setLong] = useState<string>('')
  const [selectTitle, setSelectTitle] = useState<string>('')
  const [abbreviation, setAbbreviation] = useState<string>('')
  const [nameDinas, setNameDinas] = useState<string>('')

  // Any
  const [textAlert, setTextAlert] = useState<any>(null)
  const [dataNowCoordinate, setdataNowCoordinate] = useState<any>(null)
  const [allSubdistrict, setAllSubdistrict] = useState<any[]>([])
  const [allDinas, setAllDinas] = useState<any[]>([])
  const [allTitle, setAllTitle] = useState<any[]>([])

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isDesktop = screenWidth >= 900;

  useEffect(() => {
    (async () => {
      console.log('test')
      const resultSubdistrict = await API.getAllSubdistrict()
      const resultDinas = await API.getAllDinas()
      const resultTitle = await API.getAllTitle()
      setAllSubdistrict(resultSubdistrict.data.data)
      setAllTitle(resultTitle.data.data)
      setAllDinas(resultDinas.data.data)
      setStatus(false)
    })()
  }, [status])

  const auth = store.getState().Auth.auth ?? ''
  console.log(auth)
  
  const handleStatus = () => {
    setStatus(true)
  }

  const handleAlert = (textAlert?: string) => {
    setAddService(false)
    setAddGeospasial(false)
    setAddSubdistrict(false)
    setActiveSidebarUpdateSub(false)
    setActiveUpdate('')
    setTextAlert(textAlert)
    setAlert(true)
    setStatus(true)
    setUpdateDinas(false)
  }

  const closePopup = () => {
    setAddGeospasial(false)
    setAddService(false)
    setAddKoordinat(false)
    setAddSubdistrict(false)
  }

  const handleSubdistrict = () => {
    setAddSubdistrict(true)
  }

  console.log(allSubdistrict)
 
  const dataDinasNow = {
    name_dinas: nameDinas,
    abbreviation: abbreviation,
    dinas_id: dinasID
  }

  console.log(dataDinasNow)

  const popups = [
    { condition: addSubdistrict, component: <PopupSubdistrict handleAlert={(textAlert?: string) => handleAlert(textAlert)} close={() => closePopup()} /> },
    { condition: updateDinas, component: <PopupUpdateService data={dataDinasNow} close={() => setUpdateDinas(!updateDinas)} handleAlert={handleAlert} /> },
    { condition: addService, component: <PopupService close={closePopup} handleAlert={handleAlert} /> },
    { condition: alert, component: (
      <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700 bg-opacity-[0.7]'>
        <div className='w-[400px] h-max rounded-[20px] flex flex-col text-center bg-white p-7 border border-slate-300'>
          <img src={Success} className='w-[70px] mx-auto' alt="success" />
          <p className='mt-4'>{textAlert !== '' ? textAlert : 'Berhasil tambah data!'}</p>
          <button onClick={() => setAlert(false)} className='w-max mx-auto mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-white border border-black text-black'>
            <p>Kembali sekarang</p>
          </button>
        </div>
      </div>
    ) },
    { condition: addGeospasial, component: <PopupTitleGeospasial handleStatus={() => handleStatus()} dinasID={dinasID} close={closePopup} handleAlert={handleAlert} /> },
    { condition: addKoordinat, component: <PopupKoordinat dataSubdistrict={allSubdistrict ?? []} handleDone={() => setAddKoordinat(!addKoordinat)} titleID={titleID} close={closePopup} handleStatus={() => handleStatus()} handleAlert={handleAlert} /> },
  ];

  const handleFinallyRemoveDinas = async (dinas_id: string) => {
    const result = await API.removeDinas(dinas_id)
    console.log(result)
    if(result.data.status === 200) {
      setStatus(true)
      setTextAlert('Berhasil hapus dinas!')
      handleAlert()
    }
  }

  const handleRemoveDinas = async (id: string) => {
    SweetAlert({
      text: 'Yakin hapus dinas ?',
      icon: 'question',
      onClick: () => handleFinallyRemoveDinas(id)
    })
  }

  const handleFinallyRemoveTitle = async (title_id: string) => {
      const result = await API.removeTitle(title_id)
      console.log(result)
      if(result.data.status === 200) {
        setStatus(true)
        setTextAlert('Berhasil hapus data!')
        handleAlert()
      }
  }

  const handleRemoveTitle = async (title_id: string) => {
      SweetAlert({
        text: 'Yakin hapus judul ?',
        icon: 'question',
        onClick: () => handleFinallyRemoveTitle(title_id)
      })
    }
  
  const handleOutFinally = () => {
    navigate('/')
  }
    
  const handleOut = () => {
    SweetAlert({
      text: 'Yakin ingin keluar ?',
      icon: 'question',
      onClick: () => handleOutFinally()
    })
  }

  const handleFinallySub = async (id: string) => {
    const result = await API.removeSubdistrict(id)
    if(result.data.status === 200) setStatus(true)
  }

  const handleFinallyCor = async (titleID: string, coordinateID: string) => {
    const data = {
      title_id: titleID,
      coordinate_id: coordinateID
    }
    console.log(data)
    const result = await API.removeCoordinate(data)
    console.log('ddd', result)
    if(result.data.status === 200) setStatus(true)
  }

  const handleDeleteSubdistrict = async (id: string) => {
    SweetAlert({
      text: 'Yakin hapus kecamatan ?',
      icon: 'question',
      onClick: () => handleFinallySub(id)
    })
  }

  const handleDeleteCoordinate = async (data: any) => {
    SweetAlert({
      icon: 'question',
      text: 'Yakin hapus koordinat ?',
      onClick: () => handleFinallyCor(data.title_id, data.coordinate_id)
    })
  }

  const mapRef: RefObject<any> = useRef<any>(null); // Make sure it's initialized properly

  const handleCloseUpdate = () => {
    setActiveUpdate('')
    setActiveSidebarUpdateSub(false)
  }

  const dataNowSubdistrict = () => {
    console.log(lat, long)
      return {
        name: selectNameSub,
        id: subdistrictID ,
        lat,
        long
      }
  }

  const exportToExcel = () => {
    const getCoordinate = () => {
      let coordinateList: any = [];
      allTitle && allTitle.forEach((data: any) => {
        coordinateList.push(data.coordinate);
      });
      return coordinateList;
    }
    const listCoordinate = getCoordinate();

    listCoordinate[0].sort((a: any, b: any) => {
        const kecamatanA = a.name_location.toUpperCase(); // Konversi kecamatam menjadi huruf besar untuk memastikan urutan yang konsisten
        const kecamatanB = b.name_location.toUpperCase();
      
        if (kecamatanA < kecamatanB) {
          return -1;
        }
        if (kecamatanA > kecamatanB) {
          return 1;
        }
      
        // Jika kedua kecamatan sama, tidak perlu melakukan perubahan pada urutan
        return 0;
    });
  
    const filteredArray = listCoordinate[0] && listCoordinate[0]?.map((obj: any, index: number) => ({
      No: (index + 1).toString(),
      Nama_lokasi: obj?.name_location,
      Latitude: obj?.lat,
      Longitude: obj?.long,
      Kecamatan: obj?.subdistrict
    }));
  
    if (filteredArray) {
      const newTableData = convertArrayOfObjectsToArray(filteredArray);
  
      const wb = XLSX.utils.book_new();

      // Add data to a new worksheet
      const ws = XLSX.utils.aoa_to_sheet(newTableData);
  
      // Auto-adjust column widths based on content
      const range = XLSX.utils.decode_range(ws['!ref'] as any);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let max_width = 0;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
          if (!cell) continue;
          const cell_width = cell.v.toString().length;
          if (cell_width > max_width) max_width = cell_width;
        }
        ws['!cols'] = ws['!cols'] || [];
        ws['!cols'][C] = { width: max_width + 2 }; // Tambahkan margin untuk keamanan
      }
  
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      // Save the workbook
      XLSX.writeFile(wb, 'geospasial.xlsx');
    };
  }

  const exportToPDF = () => {
    const doc = new jsPDF() as any;
    const getCoordinate = () => {
      let coordinateList: any = [];
      allTitle && allTitle.forEach((data) => {
        coordinateList.push(data.coordinate);
      });
      return coordinateList;
    }
  
    const listCoordinate = getCoordinate();
    listCoordinate[0].sort((a: any, b: any) => {
        const kecamatanA = a.name_location.toUpperCase(); // Konversi kecamatam menjadi huruf besar untuk memastikan urutan yang konsisten
        const kecamatanB = b.name_location.toUpperCase();
      
        if (kecamatanA < kecamatanB) {
          return -1;
        }
        if (kecamatanA > kecamatanB) {
          return 1;
        }
      
        // Jika kedua kecamatan sama, tidak perlu melakukan perubahan pada urutan
        return 0;
    });

    const filteredArray = listCoordinate[0] && listCoordinate[0]?.map((obj: any, index: number) => ({
      No: index + 1,
      Nama_lokasi: obj?.name_location,
      Latitude: obj?.lat,
      Longitude: obj?.long,
      Kecamatan: obj?.subdistrict
    }));

    // Tambahkan judul
    const titleText = "Data geospasial";
    const fontSize = 16;
    const pageWidth = doc.internal.pageSize.getWidth();
    const { w } = doc.getTextDimensions(titleText, { fontSize }); // Menggunakan properti 'w' bukan 'width'
    const textX = (pageWidth - w) / 2;
    doc.text(titleText, textX, 10);

    // Get table data
    const tableData = convertArrayOfObjectsToArray(filteredArray);

    // Add table headers
    const headers = Object.keys(tableData[0]);
    const data = tableData.map(obj => headers.map(key => obj[key])).slice(1);
  
    // Add table to PDF
    doc.autoTable({
      head: [tableData[0]],
      body: data,
      startY: 20
    });
    
    // Save PDF file
    doc.save('geospasial.pdf');
  }

  const handleLink = (link: string) => {
    window.open(link, '_blank');
  }

  return (
    <>
    {
      isDesktop ? (
        <div className='min-h-screen flex overflow-hidden'>
           
           {/* Popup(s) */}
          {popups.map((popup, index) => popup.condition && (
            <React.Fragment key={index}>
              {popup.component}
            </React.Fragment>
          ))}
          
          <div className={`relative ${activeWidth ? 'w-0 ml-[-60px]' : 'w-[30vw]'} duration-200 ease h-screen overflow-y-auto bg-slate-700 border-r border-r-slate-300 py-6 px-7`}>
              <img src={EarthPNG} alt="side-bg" className='absolute scale-[1.8] z-[1] left-[-15px] bottom-[-150px] opacity-[0.1]' />
              <div className='relative w-full h-max z-[40] flex mb-10 items-center justify-between'>
                <h2 onClick={() => window.location.reload()} className={`cursor-pointer active:scale-[0.98] hover:brightness-[90%] text-white text-[22px] ${activeWidth ? 'hidden' : 'inline'}`}>Geospasial ✨</h2>
                <button title='Buat dinas baru' onClick={() => setAddService(!addService)} className={`w-max border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max ${activeWidth ? 'hidden' : 'flex'} items-center px-5 py-2 rounded-full text-[16px] bg-white text-black`}>
                  <p className='mr-4'>
                    Dinas Baru
                  </p>
                  <FaPlus />
                </button>
              </div>
    
              <div className='relative w-full h-[1px] bg-white mb-9 z-[40]'></div>
    
              {
                allDinas && allDinas.length > 0 ? (
                  allDinas.map((data: any, index: number) => (
                    <div 
                        key={index} 
                        className={`relative ${data.dinas_id === dinasID ? 'border-2 bg-blue-400 text-white' : 'border border-white bg-white'} cursor-pointer active:scale-[0.99] z-[40] w-full flex justify-between items-center px-4 h-[80px] rounded-[12px] overflow-hidden text-black mb-5`}
                      >
                      <div className='w-[78%] h-max' 
                        onClick={() => {
                            setDinasID(data?.dinas_id)
                            setTitleID('')
                            setNameDinas(data?.name_dinas)
                            setAbbreviation(data?.abbreviation)
                            setShowAll(false)
                            setActivePage('peta')
                            setActiveHeight(false)
                          }
                        } 
                      >
                        <p title='nama dinas' className={`text-[18px] underline overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full ${data.dinas_id === dinasID ? 'text-white' : 'text-blue-500 hover:text-blue-700'} ${activeWidth ? 'hidden' : 'block'}`}>{data?.name_dinas}</p>
                        <small className={`text-[14px] ${activeWidth ? 'hidden' : 'block'}`}>( { data?.abbreviation } )</small>
                      </div>
                      <div title='Hapus dinas' onClick={() => handleRemoveDinas(data?.dinas_id)} className='w-[55px] border-l border-white acive:scale-[0.98] hover:bg-slate-500 cursor-pointer h-full flex justify-center items-center font-normal p-2 text-white bg-blue-400 relative left-4'>
                        <FaTimes className='cursor-pointer active:scale-[0.98]' />
                      </div>
                    </div>
                  ))
                ):
                  <div className='border text-center border-dashed text-slate-400 border-black cursor-pointer active:scale-[0.99] w-full bg-white flex justify-between items-center px-4 h-[80px] rounded-[12px] overflow-hidden mb-5'>
                    <p>Data dinas masih kosong!..</p>
                  </div>
              }
          </div>
    
          <div className={`${activeWidth ? 'w-[100vw]' : 'w-[70vw]'} h-screen overflow-y-auto px-8 pb-6 pt-5`}>
            <div className={`w-full ${activeHeight ? 'mt-[-120px] opacity-0' : 'mt-0 opacity-1'} flex duration-200 ease items-center pb-9`}>
              <h2 title='Judul website' className='text-[21px]'>Data Geospasial 🗺️</h2>
              <div className='w-[1px] mx-5 h-[22px] bg-black rounded-full'></div>
              <button title='Lihat pea' onClick={() => titleID === '' ? null : setActivePage('')} className={`w-max mr-6 border border-black ${titleID === '' ? 'cursor-not-allowed bg-slate-200 text-slate-400' : 'hover:brightness-[90%] active:scale-[0.99] duration-100'} duration-100 h-max ${(activePage === '' || activePage === 'peta') && titleID !== '' ? 'flex bg-slate-700 text-white' : 'bg-white text-black'} items-center px-5 py-2 rounded-full text-[16px]`}>
                <p>
                  Peta
                </p>
              </button>
              <button title='LIhat daftar kecamatan' onClick={() => activePage === 'subdistrict' ? setActivePage('') : setActivePage('subdistrict')} className={`w-max mr-6 ${activePage === 'subdistrict' ? 'bg-slate-700 text-white' : 'bg-white text-black'} border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-2 rounded-full text-[16px]`}>
                <p>
                  Kecamatan
                </p>
              </button>
              <button title='LIhat daftar kecamatan' onClick={() => titleID === '' ? null : (activePage === 'grafik' ? setActivePage('') : setActivePage('grafik'))} className={`w-max mr-6 ${activePage === 'grafik' ? 'bg-slate-700 text-white' : 'bg-white text-black'} ${titleID === '' ? 'cursor-not-allowed bg-slate-200 text-slate-400' : 'hover:brightness-[90%] active:scale-[0.99] duration-100'} border border-black h-max flex items-center px-5 py-2 rounded-full text-[16px]`}>
                <p>
                  Grafik data
                </p>
              </button>
              <div className='w-max mt-0 flex ml-auto items-center'>
                <p className='mr-5 text-[18px]'>{auth?.user_id}</p>
                <div onClick={() => handleOut()} className='relative w-[50px] hover:bg-red-500 active:scale-[0.99] cursor-pointer ml-auto text-white bg-slate-700 h-[50px] rounded-full bg-contain flex justify-center items-center'>
                  <FaSignOutAlt />
                </div>
              </div>
            </div>
    
            <div className='w-full h-[1px] bg-black'></div>
    
            <div className='mt-5 w-full flex flex-wrap'>
              {
                  titleID !== '' ? (
                    // Tampilkan peta 
                    activePage === 'subdistrict' ? (
                      <Subdistrict 
                        update={(id: string, name: string) => {
                          setSubdistrictID(id)
                          setSelectNameSub(name)
                          setActiveUpdate('subdistrict')
                          setActiveSidebarUpdateSub(true)
                        }} 
                        onDeleteSubdistrict={(e: string) => handleDeleteSubdistrict(e)} 
                        dataSubdistrict={allSubdistrict && allSubdistrict.length > 0 ? allSubdistrict : []} 
                        handleSubdistrict={() => handleSubdistrict()} 
                      />
                    ):
                    activePage === 'grafik' ? (
                      <Grafik data={allTitle ?? []} dinasID={dinasID} />
                    ):
                      <div className='w-full'>
                        
                        <div className='w-full flex items-center justify-between'>
                          <h2 className='font-bold text-[26px] my-6 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[50%]'>{selectTitle}</h2>
                          <div className='w-[50%] pl-16 mt-[-16px] h-max flex items-center justify-end'>
                            <div className="relative top-1">
                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="text" id="search" name='search' onChange={(e: any) => setSearch(e.target.value)} className="block px-2 ps-10 py-3 text-sm text-gray-900 border border-slate-700 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-700 dark:placeholder-slate-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
                            </div>
                          </div>
                        </div>
                        <div className={`w-full ${activeHeight ? 'h-[80vh]' : 'h-[72vh]'} border-[1px] border-black ease duration-200 rounded-[16px] overflow-hidden mt-3`}>
                          <Map dataSubdistrict={allSubdistrict} handleShowAll={() => setShowAll(!showAll)} showAll={showAll} search={search} width={activeWidth} height={activeHeight} handleWidth={() => setActiveWidth(!activeWidth)} handleHeight={() => setActiveHeight(!activeHeight)} ref={mapRef} data={!showAll ? allTitle?.filter((data: any) => data?.title_id === titleID) : allTitle?.filter((data: any) => data?.dinas_id === dinasID) ?? []} line={line} handleAddKoordinat={() => setAddKoordinat(true)} />
                        </div>
                        
                        <h2 className='font-bold text-[26px] my-8'>Daftar (lokasi & bangunan)</h2>
                        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 dark:bg-gray-900">
                            <div className="relative">
                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="text" name='search' value={search} onChange={(e:any) => setSearch(e.target.value)} id="table-search-users" className="block px-2 ps-10 py-3 text-sm text-gray-900 border border-slate-700 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-700 dark:placeholder-slate-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
                            </div>
                            <div className='w-max flex items-center'>
                              <button onClick={() => exportToExcel()} className='border-0 outline-0 rounded-full flex items-center active:scale-[0.98] hover:brightness-[90%] bg-green-500 text-white px-6 py-2'>Excel <FaFileExcel className='ml-3' /></button>
                              <button onClick={() => exportToPDF()} className='border-0 outline-0 active:scale-[0.98] hover:brightness-[90%] rounded-full flex ml-4 items-center bg-red-500 text-white px-6 py-2'>PDF <FaFilePdf className='ml-3' /></button>
                            </div>
                        </div>
    
                        <div className="relative w-full mt-2 border-[1px] border-black overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="w-[350px] pl-6 py-6">
                                            Lokasi
                                        </th>
                                        <th scope="col" className="py-6">
                                            Latitude
                                        </th>
                                        <th scope="col" className="py-6">
                                          Longitude
                                        </th>
                                        <th scope="col" className="py-6">
                                            Kecamatan
                                        </th>
                                        <th scope="col" className="py-6">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                  {
                                     allTitle && allTitle.length > 0 ? (
                                      allTitle
                                      .filter((data: any) => data?.dinas_id === dinasID)
                                      .map((data: any) => (
                                        data.coordinate
                                        .filter((sub: any) => {
                                          // Jika pencarian tidak kosong, filter data berdasarkan label yang cocok dengan pencarian
                                          if (search && search !== '') {
                                            return sub.name_location.toLowerCase().includes(search.toLowerCase());
                                          }
                                          // Jika pencarian kosong, tampilkan semua data
                                          return true;
                                        })
                                        .map((data: any, index: number) => (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                              <div className="relative w-[350px] overflow-hidden pl-6 py-4">
                                                  <div className='w-full overflow-hidden'>
                                                      <div className={`text-base font-semibold overflow-hidden overflow-ellipsis max-w-[95%] whitespace-nowrap ${data?.link !== '' && data?.link !== '-' ? 'text-blue-500 cursor-pointer undelined active:scale-[0.98]' : ''}`} onClick={() => (data?.link !== '' && data?.link !== '-' ) ? handleLink(data?.link) : null}>{data?.name_location}</div>
                                                      <div className="font-normal text-gray-500 overflow-hidden overflow-ellipsis max-w-[95%] whitespace-nowrap">Kabupaten cirebon</div>
                                                  </div>  
                                              </div>
                                              <td className="py-4">
                                                {parseFloat(data.lat).toFixed(5)}
                                              </td>
                                              <td className="py-4">
                                                {parseFloat(data.long).toFixed(3)}
                                              </td>
                                              <td className="py-4">
                                                {data.subdistrict}
                                              </td>
                                              <td className="py-4 flex items-center">
                                                  <button className='w-[35px] h-[35px] hover:brightness-[90%] rounded-md p-1 bg-yellow-500 text-white text-center flex items-center justify-center' 
                                                    onClick={() => {
                                                      setActiveSidebarUpdateSub(true)
                                                      setActiveUpdate('coordinate')
                                                      setdataNowCoordinate(data)
                                                    }}>                                                
                                                    <FaPenAlt />
                                                  </button>
                                                  <button className='w-[35px] h-[35px] hover:brightness-[90%] rounded-md p-1 bg-red-500 text-white text-center flex items-center justify-center ml-2' onClick={() => handleDeleteCoordinate(data)}><FaTrash /></button>
                                              </td>
                                          </tr>
                                        ))
                                      ))
                                     ):
                                      null
                                  }
                                </tbody>
                            </table>
                        </div>
                      </div>
                  ): (
                    activePage === 'subdistrict' ? (
                      <Subdistrict 
                        update={(id: string, name: string, lat: any, long: any) => {
                          console.log('d', lat, long)
                          setSubdistrictID(id)
                          setSelectNameSub(name)
                          setLat(lat)
                          setLong(long)
                          setActiveUpdate('subdistrict')
                          setActiveSidebarUpdateSub(true)
                        }} 
                        onDeleteSubdistrict={(e: string) => handleDeleteSubdistrict(e)}
                        dataSubdistrict={allSubdistrict && allSubdistrict.length > 0 ? allSubdistrict : []} 
                        handleSubdistrict={() => handleSubdistrict()} 
                      />
                    ):
                      <>
                        <div className={`${dinasID !== '' && titleID=== '' ? 'flex' : 'hidden'} w-full mt-4 items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 dark:bg-gray-900`}>
                            <div className="relative">
                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="text" name='searchSubdistrict' value={searchTitle} onChange={(e: any) => setSearchTitle(e.target.value)} id="search" className="block px-2 py-3 ps-10 text-sm text-gray-900 border-2 border-slate-700 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cari judul geospasial...." />
                            </div>
                            <button onClick={() => setUpdateDinas(!updateDinas)} className='w-max border border-black hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-2 rounded-full text-[16px] bg-slate-700 text-white'>
                              <p className='mr-4'>
                                  Perbarui dinas
                              </p>
                              <FaPenAlt />
                            </button>
                        </div>
    
                        <div className={`${dinasID !== '' && titleID=== '' ? 'flex' : 'hidden'} w-full h-[1px] mb-4 mt-5 bg-black`}></div>
                       
                        <div title='Tambah koordinat/lokasi baru' onClick={() => setAddGeospasial(!addGeospasial)} className={`w-[96%] md:w-[30%] border-[2px] border-slate-700 px-6 h-[180px] mr-4 mt-6 rounded-lg cursor-pointer shadow-lg p-4 bg-white ${dinasID !== '' ? 'flex' : 'hidden'} items-center justify-center flex-col hover:brightness-[95%] active:scale-[0.98]`}>
                            <FaPlus />
                            <small className="mt-5 text-[14px] text-slate-400">Tambahkan data geospasial</small>
                        </div>
        
                        {
                          dinasID === '' && typeof dinasID === 'string' ? (
                            <div className='flex h-full mt-[240px] text-[22px] text-slate-500 flex-col items-center w-full justify-center'>
                                <p>Selamat datang di geospasialcirebonkab</p>
                            </div>
                          ):
                          allTitle && allTitle.length > 0 ? (
                            allTitle
                            .filter((data: any) => {
                              if(searchTitle !== '') {
                                return data.title.toLowerCase().includes(searchTitle.toLowerCase()) && data?.dinas_id === dinasID
                              } else {
                                return true
                              }
                            })
                            .map((data: any, index: number) => (
                              <div key={index} className='cursor-pointer relative w-[96%] md:w-[30%] border-[2px] border-slate-700 px-4 h-[180px] flex flex-col justify-between mr-4 mt-6 rounded-lg shadow-lg p-4 bg-white'>
                                  <h2 onClick={() => {setTitleID(data.title_id), setSelectTitle(data.title)}} className="max-w-[926%] cursor-pointer hover:text-blue-600 active:scale-[0.98] text-blue-400 overflow-hidden overflow-ellipsis whitespace-nowrap border-b border-b-slate-700 pb-4 mt-2 text-[16px]">{ data?.title }</h2>
                                  <div className='w-full flex items-center justify-between'>
                                    <p onClick={() => {setTitleID(data.title_id), setSelectTitle(data.title)}} className='max-w-[926%] text-slate-500 overflow-hidden overflow-ellipsis whitespace-nowrap'>{ (data?.coordinate)?.length } Data koordinat</p>
                                    <div onClick={() => handleRemoveTitle(data?.title_id)} className='w-[30px] h-[30px] rounded-full bg-red-500 text-white flex items-center justify-center p-[10px] cursor-pointer hover:bg-red-600 active:scale-[0.98]'>
                                      <FaTrash />
                                    </div>
                                  </div>
                              </div>
                            ))
                          ):
                            null
                        }
                      </>
                  )
              }
            </div>
          </div>
    
          {/* Sidebare update */}
          {
            activeSidebarUpdateSub ? (
              <div className={`${activeUpdate === 'coordinate' ? 'w-[50vw]' : 'w-[34vw]'} border-l-black border fixed top-0 right-0 h-screen overflow-y-auto p-8 bg-white shadow-lg z-[99999999999999999999]`}>
                <div title='close sidebar' onClick={() => {
                  setActiveSidebarUpdateSub(false)
                  setActiveUpdate('')
                }} 
                className='absolute top-0 right-0 w-[40px] cursor-pointer hover:brightness-[90%] active:scale-[0.98] h-[40px] text-center flex justify-center items-center text-white bg-red-500'>
                  <FaTimes />
                </div>
                {
                  activeUpdate === 'subdistrict' ? (
                    <FormGroup handleAlert={(textAlert?: string) => handleAlert(textAlert)} handleStatus={() => handleStatus()} data={dataNowSubdistrict} close={() => handleCloseUpdate()} type='update-subdistrict' />
                  ): activeUpdate === 'coordinate' ? (
                    <FormGroup dataSubdistrict={allSubdistrict ?? []} handleAlert={(textAlert?: string) => handleAlert(textAlert)} handleStatus={() => handleStatus()} data={dataNowCoordinate} close={() => handleCloseUpdate()} type='update-coordinate' />
                  ):
                    null
                }
              </div>
            ):
              null
          }
        </div>
      ):
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <img src={Device} alt="notFound" className="mb-[24px] w-[200px]" />
            <p className="text-[18px] font-normal">Kami sarankan akses melalui desktop.</p>
        </div>
    }
    </>
  )
}

export default Homepage
