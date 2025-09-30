import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { 
  Menu, 
  Home, 
  Database, 
  BarChart3, 
  FileText, 
  Settings, 
  User, 
  LogOut,
  Languages,
  Bell,
  Search,
  Sparkles,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTranslation } from '../utils/translations';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  language: 'en' | 'ml';
}

export function Layout({ children, user, currentPage, onNavigate, onLogout, language }: LayoutProps) {
  const t = useTranslation(language);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  const getNavigationItems = () => {
    const coreItems = [
      { id: `${user?.role}-dashboard`, label: 'Dashboard', icon: Home },
      { id: 'dynamic-analytics', label: 'Dynamic Analytics', icon: BarChart3, badge: 'NEW' },
      { id: 'digital-twin', label: 'Digital Twin AI', icon: Sparkles },
      { id: 'data-upload', label: 'Data Upload Center', icon: Database },
      { id: 'data-explorer', label: 'Data Explorer', icon: Database },
      { id: 'marine-map', label: 'Marine Map', icon: BarChart3, badge: 'NEW' },
      { id: 'explore-features', label: 'AI Tools', icon: Zap }
    ];

    // Admin-specific items
    const adminItems = user?.role === 'admin' ? [
      { id: 'admin-dashboard', label: 'Administration', icon: Shield, isSection: true },
      { id: 'user-management', label: 'User Management', icon: User, isSubItem: true },
      { id: 'system-administration', label: 'System Administration', icon: Settings, isSubItem: true },
      { id: 'dataset-approvals', label: 'Dataset Approvals', icon: FileText, isSubItem: true },
      { id: 'activity-logs', label: 'Activity Logs', icon: BarChart3, isSubItem: true }
    ] : [];

    // Marine Crime Detection is available to all roles except researchers
    const crimeDetectionItems = user?.role !== 'researcher' ? [
      { id: 'marine-crime-detection', label: 'Marine Crime Detection', icon: Shield }
    ] : [];

    // Role-specific items
    const roleSpecificItems = {
      researcher: [
        { id: 'otolith-viewer', label: 'Otolith Lab', icon: BarChart3 },
        { id: 'edna-lab', label: 'eDNA Lab', icon: Database }
      ],
      policymaker: [
        { id: 'policy-tools', label: 'Policy Tools', icon: Settings }
      ],
      conservationist: [
        { id: 'conservation-tools', label: 'Conservation Tools', icon: FileText }
      ],
      admin: []
    };

    return [
      ...coreItems,
      ...crimeDetectionItems,
      ...(roleSpecificItems[user?.role as keyof typeof roleSpecificItems] || []),
      ...adminItems
    ];
  };

  const navigationItems = getNavigationItems();

  const SidebarContent = ({ collapsed = false, isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className={`p-6 border-b ${collapsed && !isMobile ? 'px-3' : ''}`}>
        <div className="flex items-center space-x-3">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1739460677746-7aec1b70a3f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBnb3Zlcm5tZW50JTIwZW1ibGVtfGVufDF8fHx8MTc1ODM3NDU0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="CMLRE backbone Logo"
            className="h-8 w-8 rounded-full flex-shrink-0"
          />
          {(!collapsed || isMobile) && (
            <div className="overflow-hidden">
              <h3 className="font-semibold text-[#003366] text-sm">CMLRE backbone</h3>
              <p className="text-xs text-gray-500 truncate">Marine Data Backbone for Smart India</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 p-4 space-y-1 ${collapsed && !isMobile ? 'px-2' : ''}`}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          // Section headers for admin
          if (item.isSection) {
            return (
              <div key={item.id} className={`pt-4 pb-2 ${collapsed && !isMobile ? 'hidden' : ''}`}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                  {item.label}
                </h3>
              </div>
            );
          }
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size={collapsed && !isMobile ? "sm" : "default"}
              className={`w-full ${collapsed && !isMobile ? 'justify-center px-2' : 'justify-start'} ${
                item.isSubItem ? 'ml-4' : ''
              } ${
                isActive 
                  ? 'bg-[#003366] text-white hover:bg-[#004080]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
              title={collapsed && !isMobile ? item.label : undefined}
            >
              <IconComponent className={`h-4 w-4 ${(!collapsed || isMobile) ? 'mr-3' : ''}`} />
              {(!collapsed || isMobile) && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === 'NEW' ? 'default' : 'secondary'} 
                      className={`text-xs ml-2 ${
                        item.badge === 'NEW' 
                          ? 'bg-green-600 text-white' 
                          : item.badge === 'ML'
                          ? 'bg-purple-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Button>
          );
        })}
      </nav>

      {/* User Actions */}
      <div className={`p-4 border-t ${collapsed && !isMobile ? 'px-2' : ''}`}>
        <div className="space-y-1">
          <Button
            variant="ghost"
            size={collapsed && !isMobile ? "sm" : "default"}
            className={`w-full ${collapsed && !isMobile ? 'justify-center px-2' : 'justify-start'} text-gray-600 hover:text-gray-900 hover:bg-gray-100`}
            onClick={() => {
              onNavigate('settings');
              setSidebarOpen(false);
            }}
            title={collapsed && !isMobile ? t('settings') : undefined}
          >
            <Settings className={`h-4 w-4 ${(!collapsed || isMobile) ? 'mr-3' : ''}`} />
            {(!collapsed || isMobile) && t('settings')}
          </Button>
          
          <Button
            variant="ghost"
            size={collapsed && !isMobile ? "sm" : "default"}
            className={`w-full ${collapsed && !isMobile ? 'justify-center px-2' : 'justify-start'} text-gray-600 hover:text-gray-900 hover:bg-gray-100`}
            onClick={() => {
              onNavigate('profile');
              setSidebarOpen(false);
            }}
            title={collapsed && !isMobile ? t('profile') : undefined}
          >
            <User className={`h-4 w-4 ${(!collapsed || isMobile) ? 'mr-3' : ''}`} />
            {(!collapsed || isMobile) && t('profile')}
          </Button>
          
          {(!collapsed || isMobile) && <Separator className="my-2" />}
          
          <Button
            variant="ghost"
            size={collapsed && !isMobile ? "sm" : "default"}
            className={`w-full ${collapsed && !isMobile ? 'justify-center px-2' : 'justify-start'} text-red-600 hover:text-red-700 hover:bg-red-50`}
            onClick={onLogout}
            title={collapsed && !isMobile ? t('logout') : undefined}
          >
            <LogOut className={`h-4 w-4 ${(!collapsed || isMobile) ? 'mr-3' : ''}`} />
            {(!collapsed || isMobile) && t('logout')}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#003366] text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden text-white hover:bg-blue-700 border border-blue-400"
                >
                  <Menu className="h-5 w-5" />
                  <span className="ml-2 text-sm">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <SidebarContent isMobile={true} />
              </SheetContent>
            </Sheet>

            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex text-white hover:bg-blue-700 border border-blue-400"
              onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
            >
              <Menu className="h-4 w-4" />
              <span className="ml-2 text-sm">
                {desktopSidebarCollapsed ? 'Expand' : 'Collapse'}
              </span>
            </Button>

            <div className="hidden lg:flex items-center space-x-3">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1739460677746-7aec1b70a3f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBnb3Zlcm5tZW50JTIwZW1ibGVtfGVufDF8fHx8MTc1ODM3NDU0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="CMLRE backbone Logo"
                className="h-8 w-8 rounded-full"
              />
              <div>
                <h1 className="text-lg font-semibold">CMLRE backbone</h1>
                <p className="text-xs text-blue-100">Marine Data Backbone for Smart India</p>
              </div>
            </div>

            {/* Current Page Title for Mobile */}
            <div className="lg:hidden">
              <h1 className="text-lg font-semibold">
                {navigationItems.find(item => item.id === currentPage)?.label || 'CMLRE backbone'}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user?.role || 'User'}
              </Badge>
              <span className="text-sm hidden lg:inline">{user?.email}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700"
            >
              <Languages className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline text-sm">{language === 'en' ? 'EN' : 'ML'}</span>
            </Button>

            {/* Always visible logout button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700 border border-blue-400"
              onClick={onLogout}
              title={t('logout')}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden xl:inline ml-2 text-sm">{t('logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r transition-all duration-300 ${
          desktopSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}>
          <SidebarContent collapsed={desktopSidebarCollapsed} />
          
          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute -right-3 top-20 bg-white border rounded-full p-1.5 shadow-md hover:bg-gray-50"
            onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
          >
            {desktopSidebarCollapsed ? (
              <ChevronRight className="h-3 w-3 text-gray-600" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-gray-600" />
            )}
          </Button>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          desktopSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className={`bg-gray-50 border-t mt-auto transition-all duration-300 ${
        desktopSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="px-4 py-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 CMLRE, Ministry of Earth Sciences, Government of India</p>
            <p className="mt-2 md:mt-0">{t('powered_by')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}