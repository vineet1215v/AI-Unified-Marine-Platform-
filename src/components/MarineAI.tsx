import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner@2.0.3";
import { 
  MessageCircle, 
  Sparkles, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  ExternalLink,
  HelpCircle,
  Database,
  BarChart3,
  Shield,
  FileText,
  Navigation,
  Lightbulb,
  Waves,
  Fish,
  Brain,
  Compass,
  Anchor,
  MapPin,
  Camera,
  Upload,
  Image as ImageIcon,
  Paperclip
} from 'lucide-react';

import chatbotIcon from 'figma:asset/3a1471360940bb2ce4a946b315d10676ba9d6ab3.png';

// Marine AI Icon using provided image
const MarineAIIcon = ({ className, isActive = false }: { className?: string; isActive?: boolean }) => (
  <div className={`relative ${className}`}>
    <img 
      src={chatbotIcon} 
      alt="Marine AI Chatbot" 
      className="w-full h-full object-contain"
    />
    {/* Active indicator */}
    {isActive && (
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    )}
  </div>
);

interface MarineAIProps {
  user?: any;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

interface AttachedImage {
  id: string;
  file: File;
  preview: string;
  description?: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  location?: Location;
  images?: AttachedImage[];
}

export function MarineAI({ user, onNavigate, currentPage }: MarineAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: `Hello${user ? ` ${user.email.split('@')[0]}` : ''}! I'm Marine AI 🌊🧠, your intelligent marine assistant for the CMLRE Marine Data Backbone platform. I specialize in ocean science, marine conservation, and can help you navigate our advanced research tools and data insights. I can also analyze images and provide location-based marine information!`,
        timestamp: new Date(),
        suggestions: [
          'Show me marine data trends',
          'Help with research methodology',
          'Analyze uploaded images',
          'Share my location for local data',
          'Generate policy recommendations'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user]);

  // Location and Image handling functions
  const requestLocation = async () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const location: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // Try to get address from coordinates (reverse geocoding simulation)
      try {
        // In a real app, you'd use a geocoding service like Google Maps or OpenStreetMap
        const response = await fetch(`https://api.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`);
        if (response.ok) {
          const data = await response.json();
          location.address = data.display_name;
        }
      } catch (error) {
        console.log('Could not get address:', error);
      }

      setCurrentLocation(location);
      toast.success('Location captured successfully');
      
      return location;
    } catch (error: any) {
      console.error('Error getting location:', error);
      let errorMessage = 'Could not get your location';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location services.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please check your connection.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: AttachedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string
        };
        
        setAttachedImages(prev => [...prev, newImage]);
        toast.success(`${file.name} attached successfully`);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    setAttachedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const getAIResponse = (userMessage: string, location?: Location, images?: AttachedImage[]): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];

    // Enhanced responses with location and image context
    if (location) {
      const locationContext = `Based on your location (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})${location.address ? ` - ${location.address}` : ''}, `;
      
      if (lowerMessage.includes('species') || lowerMessage.includes('fish') || lowerMessage.includes('marine life')) {
        response = `${locationContext}I can help identify marine species in your area. The waters around your location likely contain specific species based on depth, temperature, and habitat conditions. `;
        suggestions = ['What fish species are here?', 'Water temperature data', 'Local conservation status', 'Fishing regulations'];
      } else if (lowerMessage.includes('water') || lowerMessage.includes('ocean') || lowerMessage.includes('sea')) {
        response = `${locationContext}I can provide oceanographic data for your area including water temperature, salinity, currents, and marine protected area status. `;
        suggestions = ['Water quality data', 'Current conditions', 'Protected area info', 'Tide information'];
      } else {
        response = `${locationContext}I can provide location-specific marine data, species information, conservation status, and research opportunities in your area. `;
        suggestions = ['Local marine data', 'Species in this area', 'Research opportunities', 'Conservation projects'];
      }
    }

    if (images && images.length > 0) {
      const imageContext = `Analyzing ${images.length} image${images.length > 1 ? 's' : ''} you've shared: `;
      
      if (lowerMessage.includes('identify') || lowerMessage.includes('species') || lowerMessage.includes('what')) {
        response += `${imageContext}I can help identify marine species, analyze physical characteristics, estimate age/size, and compare with our database. For accurate identification, ensure clear images showing key features like fins, body shape, and coloration patterns.`;
        suggestions = ['Species identification', 'Age estimation', 'Compare with database', 'Physical measurements'];
      } else if (lowerMessage.includes('analyze') || lowerMessage.includes('study')) {
        response += `${imageContext}I can analyze morphological features, damage assessment, health indicators, and research applications. High-quality images allow for detailed analysis of specimens.`;
        suggestions = ['Morphological analysis', 'Health assessment', 'Research applications', 'Measurement tools'];
      } else {
        response += `${imageContext}I can help with species identification, morphological analysis, age determination, health assessment, and research documentation. What specific analysis would you like me to perform?`;
        suggestions = ['Identify species', 'Analyze features', 'Health check', 'Research documentation'];
      }
    }

    // If no location/image specific response was generated, continue with general responses
    if (!response) {
      // Context-aware responses based on current page and user role
      if (lowerMessage.includes('help') || lowerMessage.includes('guide')) {
        if (currentPage === 'data-explorer') {
          response = "I can help you navigate the Data Explorer! You can filter marine data by species, location, date range, and data type. Try using the interactive map to explore specific regions or use the advanced search to find datasets matching your research criteria.";
          suggestions = ['Show data filtering options', 'Explain map features', 'Find specific species data'];
        } else if (currentPage === 'otolith-viewer') {
          response = "The Otolith Viewer is perfect for age determination and species identification. Upload your otolith images, and I'll help you analyze growth patterns, measure annual rings, and compare with our reference database.";
          suggestions = ['Upload otolith images', 'Compare with database', 'Age analysis tutorial'];
        } else if (currentPage === 'marine-crime-detection') {
          response = "The Marine Crime Detection system monitors protected areas using satellite data. You can view real-time alerts, track violation incidents, and coordinate with authorities. The system automatically detects vessels entering restricted zones.";
          suggestions = ['View active alerts', 'Check restricted zones', 'Authority contact info'];
        } else {
          response = "I'm here to help! I can assist with platform navigation, data analysis, research methodology, conservation planning, and policy recommendations. What specific area would you like help with?";
          suggestions = ['Platform overview', 'Research tools', 'Conservation features', 'Data analysis help'];
        }
      } else if (lowerMessage.includes('data') || lowerMessage.includes('research')) {
        response = "Our platform contains extensive marine datasets including species surveys, eDNA samples, oceanographic data, and satellite imagery. I can help you find relevant data, explain analysis methods, or suggest research approaches based on your objectives.";
        suggestions = ['Browse data catalog', 'Research methodology', 'Data visualization tips', 'Export options'];
      } else if (lowerMessage.includes('conservation') || lowerMessage.includes('protect')) {
        response = "Marine conservation involves habitat protection, species monitoring, and sustainable practices. I can help you create conservation plans, analyze field data, track endangered species, and coordinate protection efforts.";
        suggestions = ['Create conservation plan', 'Species monitoring', 'Habitat analysis', 'Field reporting'];
      } else if (lowerMessage.includes('policy') || lowerMessage.includes('regulation')) {
        response = "Policy development requires data-driven insights and stakeholder engagement. I can help analyze environmental impacts, model policy scenarios, generate briefs, and recommend evidence-based regulations for marine protection.";
        suggestions = ['Policy scenario analysis', 'Impact assessment', 'Stakeholder mapping', 'Regulation templates'];
      } else if (lowerMessage.includes('navigation') || lowerMessage.includes('navigate')) {
        const roleFeatures = {
          researcher: ['Data Explorer', 'Otolith Viewer', 'eDNA Lab', 'Analytics'],
          policymaker: ['Scenario Simulator', 'Policy Brief Generator', 'Marine Crime Detection', 'Analytics', 'Reports'],
          conservationist: ['Field Reporting', 'Conservation Plans', 'Marine Crime Detection', 'Data Explorer']
        };
        const userFeatures = user ? roleFeatures[user.role as keyof typeof roleFeatures] || [] : [];
        response = `Based on your ${user ? user.role : 'current'} access, you can navigate to: ${userFeatures.length > 0 ? userFeatures.join(', ') : 'various platform features'}. I can guide you to any specific tool or explain how to use different features.`;
        suggestions = userFeatures.length > 0 ? userFeatures.slice(0, 4) : ['Login to access features', 'Platform overview', 'Feature comparison'];
      } else if (lowerMessage.includes('marine crime') || lowerMessage.includes('violation') || lowerMessage.includes('monitoring')) {
        if (user && user.role === 'researcher') {
          response = "Marine Crime Detection is not available for researcher accounts. However, I can help you with data analysis, species identification, research methodologies, and other research-focused features of the platform.";
          suggestions = ['Data analysis help', 'Species identification', 'Research tools', 'Otolith analysis'];
        } else {
          response = "Our Marine Crime Detection system uses AI-powered satellite monitoring to identify violations in protected areas. It automatically alerts authorities when vessels enter restricted zones, tracks incidents, and maintains evidence chains for legal proceedings.";
          suggestions = ['View live monitoring', 'Check violation alerts', 'Authority response times', 'Evidence tracking'];
        }
      } else if (lowerMessage.includes('ai') || lowerMessage.includes('assistant')) {
        response = "I'm Marine AI, powered by advanced machine learning to understand marine science queries. I can analyze data patterns, suggest research methodologies, help with species identification, predict environmental trends, provide contextual guidance throughout the platform, analyze images, and work with location data.";
        suggestions = ['AI capabilities overview', 'Image analysis features', 'Location-based data', 'Research assistance'];
      } else if (lowerMessage.includes('trend') || lowerMessage.includes('analysis')) {
        response = "I can help analyze marine data trends including species population changes, environmental indicators, fishing patterns, and conservation effectiveness. Our analytics tools provide visualizations, statistical analysis, and predictive modeling capabilities.";
        suggestions = ['Population trends', 'Environmental indicators', 'Fishing impact analysis', 'Conservation metrics'];
      } else {
        // Default response with role-specific guidance
        const roleContext = user ? {
          researcher: "As a researcher, you have access to comprehensive data analysis tools, the Otolith Lab, eDNA sequencing, and advanced analytics features.",
          policymaker: "As a policymaker, you can use scenario simulators, generate policy briefs, access comprehensive reports, and analyze environmental impacts.",
          conservationist: "As a conservationist, you can manage field reports, create conservation plans, monitor marine crimes, and coordinate protection efforts."
        }[user.role] : "Please log in to access role-specific features and personalized assistance.";

        response = `I understand you're asking about "${userMessage}". ${roleContext} How can I help you achieve your marine research or conservation goals today?`;
        suggestions = ['Explain platform features', 'Data analysis help', 'Research guidance', 'Conservation planning'];
      }
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachedImages.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || (attachedImages.length > 0 ? `Shared ${attachedImages.length} image${attachedImages.length > 1 ? 's' : ''}` : ''),
      timestamp: new Date(),
      location: currentLocation || undefined,
      images: attachedImages.length > 0 ? [...attachedImages] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setAttachedImages([]);
    setCurrentLocation(null);
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage.content, userMessage.location, userMessage.images);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group flex flex-col items-center">
          {/* Pulse animation ring */}
          <div className="absolute inset-0 bg-[#003366] rounded-full animate-ping opacity-30 top-0"></div>
          
          {/* Main button */}
          <Button
            size="lg"
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-[#003366] to-[#004080] hover:from-[#004080] hover:to-[#0056b3] text-white rounded-full h-16 w-16 p-0 shadow-xl transition-all duration-300 hover:scale-110 group-hover:shadow-2xl overflow-hidden mb-2"
          >
            <div className="flex flex-col items-center justify-center relative w-full h-full">
              {/* Professional Marine AI Icon */}
              <MarineAIIcon className="h-10 w-10 text-white" isActive={true} />
              <Sparkles className="h-3 w-3 absolute top-1 right-1 animate-pulse text-cyan-300" />
            </div>
          </Button>
          
          {/* Always visible Marine AI text */}
          <div className="bg-gradient-to-r from-[#003366] to-[#004080] text-white text-xs px-3 py-1 rounded-full shadow-lg border border-blue-300/30 whitespace-nowrap transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center space-x-1">
              <span className="font-medium">Marine AI</span>
            </div>
          </div>
          
          {/* Enhanced tooltip on hover */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gradient-to-r from-[#003366] to-[#004080] text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap shadow-lg border border-blue-300/30">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-cyan-300" />
                <span className="font-medium">Your Marine Research Assistant</span>
              </div>
              <div className="text-xs text-blue-200 mt-1">Click to chat about marine data & insights</div>
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#003366]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}`}>
      <Card className="h-full shadow-2xl border-2 border-[#003366]/20 bg-white">
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full relative">
                <MarineAIIcon className="h-5 w-5 text-white" isActive={true} />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center">
                  <span className="font-semibold">Marine AI</span>
                  <Sparkles className="h-4 w-4 ml-2 text-cyan-300 animate-pulse" />
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm">
                  Your Intelligent Marine Assistant
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {!isMinimized && (
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Online
              </Badge>
              {user && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  {user.role} mode
                </Badge>
              )}
              {currentPage && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  {currentPage.replace('-', ' ')}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-[#003366]' : 'bg-gradient-to-r from-blue-100 to-cyan-100'}`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <MarineAIIcon className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        
                        <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-[#003366] text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="text-sm">{message.content}</p>
                          
                          {/* Display location if present */}
                          {message.location && (
                            <div className={`mt-2 p-2 rounded ${message.type === 'user' ? 'bg-blue-800/50' : 'bg-blue-50'} border ${message.type === 'user' ? 'border-blue-600' : 'border-blue-200'}`}>
                              <div className="flex items-center space-x-1">
                                <MapPin className={`h-3 w-3 ${message.type === 'user' ? 'text-blue-200' : 'text-blue-600'}`} />
                                <span className={`text-xs ${message.type === 'user' ? 'text-blue-200' : 'text-blue-700'}`}>
                                  Location: {message.location.latitude.toFixed(4)}, {message.location.longitude.toFixed(4)}
                                </span>
                              </div>
                              {message.location.address && (
                                <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-blue-600'}`}>
                                  {message.location.address}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* Display images if present */}
                          {message.images && message.images.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {message.images.map((image) => (
                                <div key={image.id} className="relative group">
                                  <img
                                    src={image.preview}
                                    alt={image.file.name}
                                    className="w-full h-20 object-cover rounded border"
                                  />
                                  <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center`}>
                                    <span className="text-white text-xs text-center px-1">
                                      {image.file.name}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                          
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs mr-1 mb-1 h-7 bg-white hover:bg-gray-50 border-gray-300"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100">
                          <MarineAIIcon className="h-4 w-4 text-blue-600" isActive={true} />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            {/* Attachment Preview */}
            {(attachedImages.length > 0 || currentLocation) && (
              <div className="px-4 py-2 border-t bg-gray-50">
                <div className="space-y-2">
                  {/* Location Preview */}
                  {currentLocation && (
                    <div className="flex items-center justify-between bg-blue-50 p-2 rounded border">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCurrentLocation(null)}
                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Image Previews */}
                  {attachedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachedImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview}
                            alt={image.file.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-1 -right-1 h-4 w-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {/* Location Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={requestLocation}
                    disabled={isLoadingLocation}
                    className="h-10 w-10 p-0"
                    title="Share location"
                  >
                    {isLoadingLocation ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {/* Image Upload Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 p-0"
                    title="Upload images"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Marine AI anything..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && attachedImages.length === 0) || isTyping}
                  className="bg-[#003366] hover:bg-[#004080] h-10 w-10 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick('Help me navigate the platform')}
                  className="text-xs h-7"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Navigation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick('Show me data analysis features')}
                  className="text-xs h-7"
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick('Explain research methodologies')}
                  className="text-xs h-7"
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Research
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}