// import React, { useState, useEffect, useRef } from 'react';
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);

// // --- SVG ICONS (Self-contained components) ---
// // Using inline SVGs for icons to avoid external dependencies like lucide-react
// const Icon = ({ name, className }) => {
//     const icons = {
//         'layout-dashboard': <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />,
//         'hotel': <path d="M10 22v-6.57" /><path d="M12 11h.01" /><path d="M12 7h.01" /><path d="M14 15.43V22" /><path d="M15 16a5 5 0 0 0-6 0" /><path d="M18 18.17V22" /><path d="M21 17a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2" /><path d="M3 17a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2" /><path d="M7 16.17V22" /><path d="M4.24 15.18 2.5 12.15a2 2 0 0 1 1.1-2.81l6.4-3.68a2 2 0 0 1 2 0l6.4 3.68a2 2 0 0 1 1.1 2.81l-1.74 3.03" />,
//         'users': <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />,
//         'graduation-cap': <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0-.019 1.838l9.4 4.083a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />,
//         'shield-alert': <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v4" /><path d="M12 16h.01" />,
//         'inbox': <path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />,
//         'megaphone': <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />,
//         'bar-chart-3': <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />,
//         'settings': <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />,
//         'log-out': <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />,
//         'menu': <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />,
//         'sun': <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />,
//         'moon': <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
//         'bell': <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
//         'user-check': <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />,
//         'message-square-more': <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" />,
//         'arrow-up-right': <path d="M7 7h10v10" /><path d="M7 17 17 7" />,
//         'list-plus': <path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="M18 9v6" /><path d="M21 12h-6" />,
//         'x': <path d="M18 6 6 18" /><path d="m6 6 12 12" />,
//         'check': <path d="M20 6 9 17l-5-5" />,
//     };
//     return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{icons[name]}</svg>;
// };

// // --- COMPONENTS ---

// const Sidebar = ({ isSidebarOpen }) => {
//     const navItems = [
//         { name: 'Dashboard', icon: 'layout-dashboard', active: true },
//         { name: 'Manage Hostels', icon: 'hotel' },
//         { name: 'Manage Owners', icon: 'users' },
//         { name: 'Manage Students', icon: 'graduation-cap' },
//         { name: 'Reports & Complaints', icon: 'shield-alert' },
//         { name: 'Support Messages', icon: 'inbox' },
//         { name: 'Ads Management', icon: 'megaphone' },
//         { name: 'Analytics & Revenue', icon: 'bar-chart-3' },
//     ];

//     return (
//         <aside className={`w-64 bg-white dark:bg-gray-800 shadow-lg flex-col justify-between lg:flex transition-all duration-300 z-20 ${isSidebarOpen ? 'flex' : 'hidden'}`}>
//             <div>
//                 <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
//                     <div className="bg-[#4A90E2] text-white text-2xl font-bold rounded-lg w-12 h-12 flex items-center justify-center">CH</div>
//                     <span className="ml-3 text-xl font-semibold text-gray-700 dark:text-gray-200">Connecting Hostels</span>
//                 </div>
//                 <nav className="mt-6 flex-1 px-3">
//                     {navItems.map(item => (
//                         <a key={item.name} href="#" className={`flex items-center px-4 py-2.5 mt-2 rounded-lg transition-colors ${item.active ? 'bg-[#4A90E2] text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
//                             <Icon name={item.icon} className="w-5 h-5" />
//                             <span className="ml-4 font-semibold">{item.name}</span>
//                         </a>
//                     ))}
//                 </nav>
//             </div>
//             <div className="mb-4 px-3">
//                 <a href="#" className="flex items-center px-4 py-2.5 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//                     <Icon name="settings" className="w-5 h-5" />
//                     <span className="ml-4">Settings</span>
//                 </a>
//                 <a href="#" className="flex items-center px-4 py-2.5 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//                     <Icon name="log-out" className="w-5 h-5" />
//                     <span className="ml-4">Logout</span>
//                 </a>
//             </div>
//         </aside>
//     );
// };

// const Header = ({ toggleSidebar, toggleTheme, theme }) => (
//     <header className="sticky top-0 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm z-10 border-b dark:border-gray-700">
//         <div className="flex items-center">
//             <button onClick={toggleSidebar} className="lg:hidden mr-4 text-gray-600 dark:text-gray-300">
//                 <Icon name="menu" className="w-6 h-6" />
//             </button>
//             <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
//         </div>
//         <div className="flex items-center space-x-5">
//             <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
//                 <Icon name={theme === 'dark' ? 'moon' : 'sun'} className="w-6 h-6" />
//             </button>
//             <div className="relative">
//                 <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
//                     <Icon name="bell" className="w-6 h-6" />
//                 </button>
//                 <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
//             </div>
//             <div className="flex items-center space-x-3">
//                 <img className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-[#4A90E2]" src="https://placehold.co/100x100/4A90E2/FFFFFF?text=A" alt="Admin profile" />
//                 <div>
//                     <p className="font-semibold text-gray-700 dark:text-gray-200">Admin User</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
//                 </div>
//             </div>
//         </div>
//     </header>
// );

// const StatCard = ({ icon, title, value, color }) => (
//     <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4">
//         <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/50 rounded-full`}>
//             <Icon name={icon} className={`text-${color}-500 w-6 h-6`} />
//         </div>
//         <div>
//             <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
//             <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
//         </div>
//     </div>
// );

// const ChartComponent = ({ id, type, data, options }) => {
//     const canvasRef = useRef(null);
//     const chartRef = useRef(null);

//     useEffect(() => {
//         if (chartRef.current) {
//             chartRef.current.destroy();
//         }
//         const ctx = canvasRef.current.getContext('2d');
//         chartRef.current = new Chart(ctx, { type, data, options });

//         return () => {
//             if (chartRef.current) {
//                 chartRef.current.destroy();
//             }
//         };
//     }, [type, data, options]);

//     return <canvas ref={canvasRef} id={id}></canvas>;
// };

// const Dashboard = ({ theme }) => {
//     const isDarkMode = theme === 'dark';
//     const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
//     const labelColor = isDarkMode ? '#cbd5e1' : '#4b5563';

//     // Chart configurations
//     const revenueGrowthData = {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//         datasets: [{
//             label: 'Revenue',
//             data: [8, 10, 11.5, 11, 13, 15.7],
//             borderColor: '#4A90E2',
//             backgroundColor: (context) => {
//                 const ctx = context.chart.ctx;
//                 const gradient = ctx.createLinearGradient(0, 0, 0, 200);
//                 gradient.addColorStop(0, 'rgba(74, 144, 226, 0.6)');
//                 gradient.addColorStop(1, 'rgba(74, 144, 226, 0)');
//                 return gradient;
//             },
//             borderWidth: 2.5,
//             pointBackgroundColor: '#4A90E2',
//             tension: 0.4,
//             fill: true,
//         }],
//     };

//     const revenueGrowthOptions = {
//         responsive: true, maintainAspectRatio: false,
//         scales: { y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: labelColor, callback: (value) => `$${value}k` } }, x: { grid: { display: false }, ticks: { color: labelColor } } },
//         plugins: { legend: { display: false } }
//     };

//     const revenueSourceData = {
//         labels: ['Premium Listings', 'Ad Clicks'],
//         datasets: [{
//             data: [65, 35],
//             backgroundColor: ['#4A90E2', '#50E3C2'],
//             borderColor: isDarkMode ? '#1f2937' : '#fff',
//             borderWidth: 4,
//         }],
//     };

//     const revenueSourceOptions = {
//         responsive: true, maintainAspectRatio: false, cutout: '70%',
//         plugins: { legend: { position: 'bottom', labels: { color: labelColor, usePointStyle: true, boxWidth: 8 } } }
//     };

//     return (
//         <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <StatCard icon="hotel" title="Total Hostels" value="1,280" color="blue" />
//                 <StatCard icon="graduation-cap" title="Active Students" value="21,500" color="green" />
//                 <StatCard icon="user-check" title="Verified Owners" value="975" color="indigo" />
//                 <StatCard icon="message-square-more" title="Monthly Enquiries" value="12,340" color="yellow" />
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-6">
//                 <div className="xl:col-span-2 flex flex-col gap-6">
//                     <div className="bg-gradient-to-br from-[#4A90E2] to-[#357ABD] text-white p-6 rounded-xl shadow-lg">
//                         <p className="text-lg font-medium opacity-80">Total Revenue (This Month)</p>
//                         <p className="text-4xl font-bold mt-2">$15,750.00</p>
//                         <p className="text-sm mt-2 opacity-80 flex items-center"><Icon name="arrow-up-right" className="inline-block h-4 w-4 mr-1" /> 12.5% vs last month</p>
//                     </div>
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><h3 className="font-semibold text-lg mb-4">Revenue Growth</h3><div className="h-48"><ChartComponent id="revenueGrowthChart" type="line" data={revenueGrowthData} options={revenueGrowthOptions} /></div></div>
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"><h3 className="font-semibold text-lg mb-4">Revenue by Source</h3><div className="h-48"><ChartComponent id="revenueSourceChart" type="doughnut" data={revenueSourceData} options={revenueSourceOptions} /></div></div>
//                 </div>
//                 <div className="xl:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col">
//                     <h3 className="font-semibold text-lg mb-4">Active Hostels by Location</h3>
//                     <div className="flex-1 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
//                         <img src="https://placehold.co/800x600/E2E8F0/4A5568?text=Interactive+Map+View" className="w-full h-full object-cover" alt="Map of hostels" />
//                     </div>
//                 </div>
//             </div>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
//                     <h3 className="font-semibold text-lg mb-4">Pending Verifications</h3>
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"><div><p className="font-semibold">Sunrise Hostel</p><p className="text-xs text-gray-500">Owner: John Doe</p></div><div className="flex space-x-2"><button className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 rounded-lg"><Icon name="x" className="text-red-500 h-4 w-4" /></button><button className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 rounded-lg"><Icon name="check" className="text-green-500 h-4 w-4" /></button></div></div>
//                         <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"><div><p className="font-semibold">Scholars Abode</p><p className="text-xs text-gray-500">Owner: Jane Smith</p></div><div className="flex space-x-2"><button className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 rounded-lg"><Icon name="x" className="text-red-500 h-4 w-4" /></button><button className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 rounded-lg"><Icon name="check" className="text-green-500 h-4 w-4" /></button></div></div>
//                         <button className="w-full text-center text-sm font-semibold text-[#4A90E2] hover:underline mt-2">View All Verifications</button>
//                     </div>
//                 </div>
//                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
//                     <h3 className="font-semibold text-lg mb-4">Real-Time Activity Feed</h3>
//                     <div className="space-y-4">
//                         <div className="flex items-start space-x-3"><div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full"><Icon name="list-plus" className="text-blue-500 h-5 w-5" /></div><div><p className="text-sm">New listing <span className="font-semibold">"Cozy Corner PG"</span> submitted.</p><p className="text-xs text-gray-500">2 min ago</p></div></div>
//                         <div className="flex items-start space-x-3"><div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full"><Icon name="shield-alert" className="text-red-500 h-5 w-5" /></div><div><p className="text-sm">Report filed for <span className="font-semibold">"Student Haven"</span>.</p><p className="text-xs text-gray-500">15 min ago</p></div></div>
//                         <div className="flex items-start space-x-3"><div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full"><Icon name="megaphone" className="text-green-500 h-5 w-5" /></div><div><p className="text-sm">New ad created for <span className="font-semibold">"Sunrise Hostel"</span>.</p><p className="text-xs text-gray-500">30 min ago</p></div></div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default function App() {
//     const [theme, setTheme] = useState('light');
//     const [isSidebarOpen, setSidebarOpen] = useState(false);

//     useEffect(() => {
//         const savedTheme = localStorage.getItem('theme') || 'light';
//         setTheme(savedTheme);
//         if (savedTheme === 'dark') {
//             document.documentElement.classList.add('dark');
//         }
//     }, []);

//     const toggleTheme = () => {
//         const newTheme = theme === 'light' ? 'dark' : 'light';
//         setTheme(newTheme);
//         localStorage.setItem('theme', newTheme);
//         document.documentElement.classList.toggle('dark');
//     };

//     const toggleSidebar = () => {
//         setSidebarOpen(!isSidebarOpen);
//     };

//     return (
//         <div className="flex h-screen bg-[#F7F9FC] dark:bg-gray-900/50 text-gray-800 dark:text-gray-200">
//             <Sidebar isSidebarOpen={isSidebarOpen} />
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <Header toggleSidebar={toggleSidebar} toggleTheme={toggleTheme} theme={theme} />
//                 <Dashboard theme={theme} />
//             </div>
//         </div>
//     );
// }
