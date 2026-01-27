import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPendaftar, getAllBerita } from '../../services/api';
import { Users, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '../../components/Toast';

const Dashboard: React.FC = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalBerita: 0,
    diterima: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendaftar, berita] = await Promise.all([getPendaftar(), getAllBerita()]);
        
        const diterimaCount = pendaftar.filter((p: any) => p.status === 'diterima').length;
        
        setStats({
          totalSiswa: pendaftar.length,
          totalBerita: berita.length,
          diterima: diterimaCount
        });

        // Group by Jurusan for chart
        const grouped = pendaftar.reduce((acc: any, curr: any) => {
          const jName = curr.jurusan?.nama_jurusan || 'Lainnya';
          acc[jName] = (acc[jName] || 0) + 1;
          return acc;
        }, {});

        const data = Object.keys(grouped).map(key => ({
          name: key,
          jumlah: grouped[key]
        }));
        
        setChartData(data);
      } catch (error) {
        console.error("Error loading dashboard data", error);
        showToast('Gagal memuat data dashboard.', 'error');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm dark:shadow-slate-900 border border-gray-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-slate-700 text-secondary rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Pendaftar</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalSiswa}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm dark:shadow-slate-900 border border-gray-100 dark:border-slate-700 flex items-center gap-4">
           <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Siswa Diterima</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.diterima}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm dark:shadow-slate-900 border border-gray-100 dark:border-slate-700 flex items-center gap-4">
           <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Berita</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalBerita}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm dark:shadow-slate-900 border border-gray-100 dark:border-slate-700 h-96">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-6">Statistik Pendaftar per Jurusan</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6b7280'}} interval={0} />
            <YAxis allowDecimals={false} tick={{fill: '#6b7280'}} />
            <Tooltip 
              cursor={{fill: 'transparent'}} 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;