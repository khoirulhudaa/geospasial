import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';

interface GrafikProps {
    data?: any[];
    dinasID?: string;
    titleID?: string;
}

const Grafik: React.FC<GrafikProps> = ({ data, dinasID, titleID }) => {
    const chartRef2 = useRef<any>(null);
    const contentRef = useRef<any>(null);
    
    const [dataTitle, setDataTitle] = useState<string[]>([]);
    const [dataCoordinate, setDataCoordinate] = useState<number[]>([]);
    
    const countSubdistrictData = (data: any) => {
        const subdistrictCounts: any = {};
        data.forEach((item: any) => {
            const subdistrict = item.subdistrict;
            if (subdistrictCounts[subdistrict]) {
                subdistrictCounts[subdistrict]++;
            } else {
                subdistrictCounts[subdistrict] = 1;
            }
        });
    
        const subdistrictNames = Object.keys(subdistrictCounts);
        const subdistrictValues = Object.values(subdistrictCounts);
        
        return [subdistrictNames, subdistrictValues];
    };
    
    const [subdistrictNames, subdistrictValues] = countSubdistrictData(data?.filter((d: any) => d?.title_id === titleID)?.flatMap(entry => entry.coordinate));

    useEffect(() => {
        if (data) {
            setDataTitle(
                data
                .filter((item:any) => item.dinas_id === dinasID)
                .map((item: any) => item.title)
            );
            setDataCoordinate(data.map((item: any) => item?.coordinate.length));
        }
    }, [data, dinasID]);
    
    // Chart Data koordinat per-kecamatan
    useEffect(() => {
        if (dataTitle.length > 0 && dataCoordinate.length > 0) {
            const ctx = chartRef2.current.getContext('2d');
            if (ctx) {
                // Hancurkan chart yang ada jika sudah ada
                if (chartRef2.current.chart) {
                    chartRef2.current.chart.destroy();
                }

                // Buat chart baru
                chartRef2.current.chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: subdistrictNames,
                        datasets: [{
                            data: subdistrictValues,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: {
                                    precision: 0
                                },
                            },
                        },
                        indexAxis: 'y',
                        elements: {
                          bar: {
                            borderWidth: 2,
                          }
                        },
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false
                        },
                        }
                    },
                });
            }
        }
    }, [subdistrictNames, subdistrictValues]);

    const handleExportToPdf = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text('Data grafik geospasial Per-Kecamtan', 10, 10);

        const chartCanvas2 = chartRef2.current;

        html2canvas(chartCanvas2).then((canvas2) => {
            const imgData2 = canvas2.toDataURL('image/png');
            doc.addImage(imgData2, 'PNG', 10, 20, 180, 100);

            doc.save('chart-geospasial.pdf');
        });
    };
  
    return (
        <div className='pb-20 flex flex-col mt-2 h-max w-full' ref={contentRef}>
            <div className='flex w-full flex-col h-max mb-8'>
                <div title='Ambil gambar peta' onClick={() => handleExportToPdf()} className={`z-[3333333333333333] active:bg-red-700 text-white bg-red-500 mr-3 hover:brightness-[90%] cursor-pointer active:scale-[0.98] z-[22222] w-max h-[40px] py-2 flex items-center justify-center text-center rounded-full text-[16px] px-6 border border-red-500 top-4`}>Unduh PDF <FaFilePdf className='ml-4' /></div>
            </div>
            <div className='flex flex-col w-full h-max'>
                <h2 className='text-[22px] mb-8 mt-1 font-bold'>Data koordinat per-kecamatan</h2>
                <canvas ref={chartRef2}></canvas>
            </div>
        </div>
    );
}

export default Grafik;
