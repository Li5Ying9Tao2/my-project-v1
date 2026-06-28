import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function HomePage() {
  const navigate = useNavigate();
  const { setRole, setLoggedIn } = useAppStore();

  const handleVisitorClick = () => {
    setRole('visitor');
    setLoggedIn(true);
    navigate('/visitor');
  };

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-14 h-14 text-primary-600"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-primary-600 mb-2">纸为你</h1>
            <p className="text-gray-600">校园卫生纸物联监测系统</p>
            <p className="text-sm text-primary-500 mt-2">让校园生活更便捷</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleVisitorClick}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-md hover:shadow-lg hover:bg-primary-50 transition-all active:scale-98"
            >
              <User size={24} className="text-primary-600" />
              <span className="text-lg font-medium text-gray-800">游客登录</span>
            </button>

            <button
              onClick={handleAdminClick}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 rounded-2xl shadow-md hover:shadow-lg hover:bg-primary-700 transition-all active:scale-98 text-white"
            >
              <ShieldCheck size={24} />
              <span className="text-lg font-medium">管理员登录</span>
            </button>
          </div>

          <div className="mt-8 p-4 bg-white/50 rounded-xl">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-700 mb-1">使用方法</p>
                <p>点击"游客登录"即可快速查看校园各卫生间卫生纸状态,也可提交反馈帮助我们改进服务。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="p-4 text-center">
        <p className="text-sm text-gray-500">© 2026 纸为你 All Rights Reserved</p>
      </footer>
    </div>
  );
}