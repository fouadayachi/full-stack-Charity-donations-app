import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Header } from '../components/Admin/Header'
import { Sidebar } from '../components/Admin/Sidebar'

function Admin() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex relative min-h-screen w-full">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`flex flex-col flex-1 bg-white overflow-hidden ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet /> {/* Nested routes will be rendered here */}
        </main>
      </div>
    </div>
  )
}

export default Admin