import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Layout } from './Layout';
import { MapPin, Satellite, Navigation, Waves, Fish, Thermometer, Activity, Signal, ZoomIn, ZoomOut } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'researcher' | 'policymaker' | 'conservationist' | 'admin';
}

interface MarineMapProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  language: 'en' | 'ml';
}

const vesselData = [
  { id: 'V001', name: 'Research Vessel Sagar', lat: 19.0760, lng: 72.8777, status: 'active', lastUpdate: '2 min ago' },
  { id: 'V002', name: 'Marine Explorer', lat: 15.2993, lng: 74.1240, status: 'active', lastUpdate: '1 min ago' },
  { id: 'V003', name: 'Ocean Surveyor', lat: 11.0168, lng: 76.9558, status: 'active', lastUpdate: '3 min ago' },
  { id: 'V004', name: 'Coastal Guard 1', lat: 13.0827, lng: 80.2707, status: 'active', lastUpdate: '1 min ago' },
];

const speciesData = [
  {
    id: 'SP001',
    name: 'Spanish Mackerel',
    scientific: 'Scomberomorus commerson',
    abundance: 632,
    temperature: 27.8,
    ph: 8.2,
    biomass: 1.2,
    salinity: 35.3,
    depth: 85,
    location: 'Goa Waters',
    lat: 15.2993,
    lng: 74.1240,
    populationLevel: 'good'
  },
  {
    id: 'SP002',
    name: 'Skipjack Tuna',
    scientific: 'Katsuwonus pelamis',
    abundance: 445,
    temperature: 28.1,
    ph: 8.1,
    biomass: 0.8,
    salinity: 35.2,
    depth: 95,
    location: 'Andhra Pradesh Coast',
    lat: 16.5062,
    lng: 80.6480,
    populationLevel: 'moderate'
  },
  {
    id: 'SP003',
    name: 'Oil Sardine',
    scientific: 'Sardinella longiceps',
    abundance: 1243,
    temperature: 26.5,
    ph: 8.0,
    biomass: 2.1,
    salinity: 34.8,
    depth: 45,
    location: 'Kerala Coast',
    lat: 11.0168,
    lng: 76.9558,
    populationLevel: 'excellent'
  },
  {
    id: 'SP004',
    name: 'Indian Mackerel',
    scientific: 'Rastrelliger kanagurta',
    abundance: 287,
    temperature: 27.2,
    ph: 8.1,
    biomass: 0.9,
    salinity: 35.1,
    depth: 65,
    location: 'Tamil Nadu Coast',
    lat: 13.0827,
    lng: 80.2707,
    populationLevel: 'moderate'
  },
  {
    id: 'SP005',
    name: 'Pomfret',
    scientific: 'Pampus argenteus',
    abundance: 789,
    temperature: 26.8,
    ph: 8.0,
    biomass: 1.5,
    salinity: 34.9,
    depth: 55,
    location: 'Gujarat Coast',
    lat: 21.6417,
    lng: 69.6293,
    populationLevel: 'good'
  },
  {
    id: 'SP006',
    name: 'Threadfin Bream',
    scientific: 'Nemipterus japonicus',
    abundance: 1156,
    temperature: 27.5,
    ph: 8.1,
    biomass: 1.8,
    salinity: 35.0,
    depth: 75,
    location: 'Karnataka Coast',
    lat: 14.8497,
    lng: 74.1240,
    populationLevel: 'excellent'
  },
  {
    id: 'SP007',
    name: 'Barracuda',
    scientific: 'Sphyraena jello',
    abundance: 234,
    temperature: 28.5,
    ph: 8.2,
    biomass: 0.6,
    salinity: 35.4,
    depth: 90,
    location: 'Maharashtra Coast',
    lat: 17.9800,
    lng: 72.8300,
    populationLevel: 'moderate'
  },
  {
    id: 'SP008',
    name: 'Croaker',
    scientific: 'Johnius carutta',
    abundance: 945,
    temperature: 26.9,
    ph: 7.9,
    biomass: 1.3,
    salinity: 34.7,
    depth: 40,
    location: 'Odisha Coast',
    lat: 19.8135,
    lng: 85.8312,
    populationLevel: 'good'
  },
  {
    id: 'SP009',
    name: 'Kingfish',
    scientific: 'Scomberomorus guttatus',
    abundance: 567,
    temperature: 27.9,
    ph: 8.1,
    biomass: 1.1,
    salinity: 35.2,
    depth: 70,
    location: 'West Bengal Coast',
    lat: 21.6637,
    lng: 87.8264,
    populationLevel: 'good'
  },
  {
    id: 'SP010',
    name: 'Anchovy',
    scientific: 'Stolephorus commersonnii',
    abundance: 1567,
    temperature: 25.8,
    ph: 7.8,
    biomass: 2.5,
    salinity: 34.5,
    depth: 25,
    location: 'Lakshadweep Waters',
    lat: 11.2588,
    lng: 72.6360,
    populationLevel: 'excellent'
  }
];

const mapLayers = [
  { id: 'temperature', label: 'Temperature', enabled: true },
  { id: 'zones', label: 'Zones', enabled: false },
  { id: 'currents', label: 'Ocean Currents', enabled: true },
  { id: 'protected', label: 'Protected Areas', enabled: false },
  { id: 'shipping', label: 'Shipping Routes', enabled: false },
  { id: 'depth', label: 'Depth Contours', enabled: true }
];

// Helper functions for species population styling
const getPopulationColor = (level: string) => {
  switch (level) {
    case 'excellent': return 'bg-emerald-500';
    case 'good': return 'bg-cyan-500';
    case 'moderate': return 'bg-amber-500';
    case 'low': return 'bg-rose-500';
    default: return 'bg-gray-500';
  }
};

const getPopulationBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (level) {
    case 'excellent': return 'default';
    case 'good': return 'secondary';
    case 'moderate': return 'outline';
    case 'low': return 'destructive';
    default: return 'outline';
  }
};

export function MarineMap({ user, onNavigate, onLogout, language }: MarineMapProps) {
  const [mapStyle, setMapStyle] = useState('ocean');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [activeVessels] = useState(12);
  const [selectedSpeciesInfo, setSelectedSpeciesInfo] = useState<any>(null);
  const [layers, setLayers] = useState(mapLayers);
  const [lastUpdate] = useState('2 minutes ago');
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [currentTileLayer, setCurrentTileLayer] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };

  // Filter species data based on selections
  const getFilteredSpeciesData = () => {
    let filtered = [...speciesData];
    
    if (selectedSpecies !== 'all') {
      filtered = filtered.filter(species => 
        species.scientific.toLowerCase().includes(selectedSpecies.toLowerCase()) ||
        species.name.toLowerCase().includes(selectedSpecies.toLowerCase())
      );
    }
    
    console.log('Filtered species data:', filtered.length, 'out of', speciesData.length);
    return filtered;
  };

  // Initialize map with enhanced ocean visualization
  useEffect(() => {
    const initializeMap = () => {
      if (typeof window === 'undefined' || mapInstance || !mapRef.current) return;

      // Check if Leaflet is available
      if (typeof window !== 'undefined' && window.L) {
        try {
          const L = window.L;
          
          // Fix Leaflet default marker icons issue
          if (L.Icon && L.Icon.Default) {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
              iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });
          }
          
          // Create map instance centered on Indian Ocean
          const map = L.map(mapRef.current, {
            center: [15.0, 75.0], // Indian Ocean coordinates
            zoom: 6,
            zoomControl: false, // We'll add custom controls
            attributionControl: true,
            keyboard: false // Disable keyboard navigation to prevent interference with browser tab switching
          });

          // Add Enhanced Ocean View tile layer (CartoDB Voyager for better ocean visibility)
          const oceanLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
          }).addTo(map);

          setMapInstance(map);
          setCurrentTileLayer(oceanLayer);

          // Custom vessel icon
          const vesselIcon = L.divIcon({
            className: 'vessel-marker',
            html: '<div style="color: #3b82f6; font-size: 14px;">🚢</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          });

          // Add vessel markers
          const vesselMarkers = vesselData.map(vessel => {
            const marker = L.marker([vessel.lat, vessel.lng], { icon: vesselIcon }).addTo(map);
            marker.bindPopup(`
              <div class="p-3 min-w-48">
                <h3 class="font-semibold text-blue-900">${vessel.name}</h3>
                <div class="mt-2 space-y-1 text-sm">
                  <p><strong>Status:</strong> <span class="text-green-600 capitalize">${vessel.status}</span></p>
                  <p><strong>Last Update:</strong> ${vessel.lastUpdate}</p>
                  <p><strong>Position:</strong> ${vessel.lat.toFixed(4)}°N, ${vessel.lng.toFixed(4)}°E</p>
                </div>
              </div>
            `);
            return marker;
          });

          // Add species markers (filtered)
          const filteredSpecies = getFilteredSpeciesData();
          const speciesMarkers = filteredSpecies.map(species => {
            const color = species.populationLevel === 'excellent' ? '#10b981' : 
                         species.populationLevel === 'good' ? '#06b6d4' :
                         species.populationLevel === 'moderate' ? '#f59e0b' : '#ef4444';
            
            const marker = L.circleMarker([species.lat, species.lng], {
              radius: 15,
              fillColor: color,
              color: '#ffffff',
              weight: 4,
              opacity: 1,
              fillOpacity: 0.9,
              className: 'species-marker'
            }).addTo(map);

            marker.bindPopup(`
              <div class="p-4 min-w-72">
                <h3 class="font-semibold text-lg mb-1">${species.name}</h3>
                <p class="text-sm text-gray-600 italic mb-3">${species.scientific}</p>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div><strong>Abundance:</strong> ${species.abundance}</div>
                  <div><strong>Temperature:</strong> ${species.temperature}°C</div>
                  <div><strong>pH:</strong> ${species.ph}</div>
                  <div><strong>Salinity:</strong> ${species.salinity} PSU</div>
                  <div><strong>Depth:</strong> ${species.depth}m</div>
                  <div><strong>Biomass:</strong> ${species.biomass} tons/km²</div>
                </div>
                <div class="mt-3 pt-2 border-t">
                  <strong>Location:</strong> ${species.location}
                </div>
                <div class="mt-2">
                  <span class="inline-block px-2 py-1 rounded text-xs font-medium" style="background-color: ${color}20; color: ${color};">
                    ${species.populationLevel.charAt(0).toUpperCase() + species.populationLevel.slice(1)} Population
                  </span>
                </div>
              </div>
            `);

            marker.on('click', () => {
              setSelectedSpeciesInfo(species);
            });

            return marker;
          });

          markersRef.current = [...vesselMarkers, ...speciesMarkers];

          // Add marine boundaries (simplified)
          const indianEEZ = L.polygon([
            [8.0, 68.0],
            [24.0, 68.0],
            [24.0, 97.0],
            [6.0, 97.0],
            [6.0, 78.0],
            [8.0, 68.0]
          ], {
            color: '#1e40af',
            weight: 2,
            opacity: 0.6,
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            dashArray: '5, 10'
          }).addTo(map);

          indianEEZ.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold">Indian Exclusive Economic Zone</h3>
              <p class="text-sm text-gray-600">Marine research area</p>
            </div>
          `);

          // Add ocean current overlays for enhanced visualization
          if (layers.find(l => l.id === 'currents')?.enabled) {
            // Simulate ocean currents with animated arrows
            const currentPaths = [
              [[12.0, 70.0], [14.0, 72.0], [16.0, 74.0]],
              [[18.0, 76.0], [20.0, 78.0], [22.0, 80.0]],
              [[10.0, 74.0], [12.0, 76.0], [14.0, 78.0]]
            ];

            currentPaths.forEach((path, index) => {
              const polyline = L.polyline(path, {
                color: '#06b6d4',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 5'
              }).addTo(map);

              polyline.bindPopup(`
                <div class="p-2">
                  <h4 class="font-semibold">Ocean Current ${index + 1}</h4>
                  <p class="text-sm">Speed: 1.2-2.1 knots</p>
                </div>
              `);
            });
          }

        } catch (error) {
          console.error('Error initializing Leaflet map:', error);
          // Fallback to simulated map if Leaflet fails
          setMapInstance('fallback');
        }
      } else {
        // If Leaflet is not available, set to fallback mode
        console.log('Leaflet not available, using fallback map');
        setMapInstance('fallback');
      }
    };

    // Load Leaflet CSS and script dynamically if not available
    if (typeof window !== 'undefined' && !window.L) {
      // Load CSS first
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(cssLink);

      // Then load the script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setTimeout(initializeMap, 200); // Give a bit more time for CSS to load
      };
      script.onerror = () => {
        console.error('Failed to load Leaflet');
        setMapInstance('fallback');
      };
      document.head.appendChild(script);
    } else {
      // Leaflet is already available or we're on server
      setTimeout(initializeMap, 100);
    }

    // Cleanup function
    return () => {
      if (mapInstance && mapInstance !== 'fallback') {
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, []);

  // Handle map style changes with enhanced ocean views
  useEffect(() => {
    const changeMapStyle = () => {
      if (!mapInstance || mapInstance === 'fallback' || !currentTileLayer || !window.L) return;

      try {
        const L = window.L;

        // Remove current tile layer
        mapInstance.removeLayer(currentTileLayer);

        let newTileLayer;
        switch (mapStyle) {
          case 'satellite':
            newTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
              maxZoom: 18
            });
            break;
          case 'nautical':
            // Use GEBCO for ocean bathymetry
            newTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 18
            });
            break;
          default: // Enhanced ocean view
            newTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 20
            });
        }

        newTileLayer.addTo(mapInstance);
        setCurrentTileLayer(newTileLayer);
      } catch (error) {
        console.error('Error changing map style:', error);
      }
    };

    changeMapStyle();
  }, [mapStyle, mapInstance, currentTileLayer]);

  // Update markers when filters change
  useEffect(() => {
    if (!mapInstance || mapInstance === 'fallback' || !window.L) return;

    try {
      const L = window.L;
      
      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (marker && mapInstance.hasLayer(marker)) {
          mapInstance.removeLayer(marker);
        }
      });

      // Custom vessel icon
      const vesselIcon = L.divIcon({
        className: 'vessel-marker',
        html: '<div style="color: #3b82f6; font-size: 14px;">🚢</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      // Add vessel markers
      const vesselMarkers = vesselData.map(vessel => {
        const marker = L.marker([vessel.lat, vessel.lng], { icon: vesselIcon }).addTo(mapInstance);
        marker.bindPopup(`
          <div class="p-3 min-w-48">
            <h3 class="font-semibold text-blue-900">${vessel.name}</h3>
            <div class="mt-2 space-y-1 text-sm">
              <p><strong>Status:</strong> <span class="text-green-600 capitalize">${vessel.status}</span></p>
              <p><strong>Last Update:</strong> ${vessel.lastUpdate}</p>
              <p><strong>Position:</strong> ${vessel.lat.toFixed(4)}°N, ${vessel.lng.toFixed(4)}°E</p>
            </div>
          </div>
        `);
        return marker;
      });

      // Add filtered species markers
      const filteredSpecies = getFilteredSpeciesData();
      const speciesMarkers = filteredSpecies.map(species => {
        const color = species.populationLevel === 'excellent' ? '#10b981' : 
                     species.populationLevel === 'good' ? '#06b6d4' :
                     species.populationLevel === 'moderate' ? '#f59e0b' : '#ef4444';
        
        const marker = L.circleMarker([species.lat, species.lng], {
          radius: 15,
          fillColor: color,
          color: '#ffffff',
          weight: 4,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(mapInstance);

        marker.bindPopup(`
          <div class="p-4 min-w-72">
            <h3 class="font-semibold text-lg mb-1">${species.name}</h3>
            <p class="text-sm text-gray-600 italic mb-3">${species.scientific}</p>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div><strong>Abundance:</strong> ${species.abundance}</div>
              <div><strong>Temperature:</strong> ${species.temperature}°C</div>
              <div><strong>pH:</strong> ${species.ph}</div>
              <div><strong>Salinity:</strong> ${species.salinity} PSU</div>
              <div><strong>Depth:</strong> ${species.depth}m</div>
              <div><strong>Biomass:</strong> ${species.biomass} tons/km²</div>
            </div>
            <div class="mt-3 pt-2 border-t">
              <strong>Location:</strong> ${species.location}
            </div>
            <div class="mt-2">
              <span class="inline-block px-2 py-1 rounded text-xs font-medium" style="background-color: ${color}20; color: ${color};">
                ${species.populationLevel.charAt(0).toUpperCase() + species.populationLevel.slice(1)} Population
              </span>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedSpeciesInfo(species);
        });

        return marker;
      });

      markersRef.current = [...vesselMarkers, ...speciesMarkers];

    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [selectedSpecies, selectedSeason, mapInstance]);

  // Custom map controls
  const zoomIn = () => {
    if (mapInstance && mapInstance !== 'fallback') {
      mapInstance.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstance && mapInstance !== 'fallback') {
      mapInstance.zoomOut();
    }
  };

  const centerOnIndia = () => {
    if (mapInstance && mapInstance !== 'fallback') {
      mapInstance.setView([15.0, 75.0], 6);
    }
  };

  return (
    <Layout user={user} currentPage="marine-map" onNavigate={onNavigate} onLogout={onLogout} language={language}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-government-blue">CMLRE backbone Marine Intelligence</h1>
            <p className="text-muted-foreground mt-2">Real-time Marine Ecosystem Monitoring for Indian EEZ</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="default" className="flex items-center">
              <Signal className="w-4 h-4 mr-2" />
              {activeVessels} Active Vessels
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Live Data Stream
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mission Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Mission Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Live Marine Ecosystem Monitor</span>
                    <Badge variant="default" className="bg-green-600">LIVE</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Stations</span>
                    <span className="font-medium">{vesselData.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated</span>
                    <span className="font-medium">{lastUpdate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Satellite Link</span>
                    <Badge variant="default" className="text-xs">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Map Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Map Style</label>
                  <Select value={mapStyle} onValueChange={setMapStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ocean">Enhanced Ocean View</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="nautical">Nautical Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Species</label>
                  <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Species</SelectItem>
                      <SelectItem value="longiceps">Sardinella longiceps</SelectItem>
                      <SelectItem value="kanagurta">Rastrelliger kanagurta</SelectItem>
                      <SelectItem value="commerson">Scomberomorus commerson</SelectItem>
                      <SelectItem value="argentimaculatus">Lutjanus argentimaculatus</SelectItem>
                      <SelectItem value="calcarifer">Lates calcarifer</SelectItem>
                      <SelectItem value="argenteus">Pampus argenteus</SelectItem>
                      <SelectItem value="kelee">Atule mate</SelectItem>
                      <SelectItem value="ilisha">Tenualosa ilisha</SelectItem>
                      <SelectItem value="pelamis">Katsuwonus pelamis</SelectItem>
                      <SelectItem value="crumenophthalmus">Selar crumenophthalmus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Seasonal Pattern</label>
                  <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Seasons</SelectItem>
                      <SelectItem value="post-monsoon">Post-monsoon</SelectItem>
                      <SelectItem value="pre-monsoon">Pre-monsoon</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                      <SelectItem value="monsoon">Monsoon</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Layer Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Data Layer Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {layers.map(layer => (
                    <div key={layer.id} className="flex items-center justify-between">
                      <label className="text-sm font-medium">{layer.label}</label>
                      <Switch
                        checked={layer.enabled}
                        onCheckedChange={() => toggleLayer(layer.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Population Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Population Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                      <span className="text-sm">Excellent</span>
                    </div>
                    <span className="text-xs text-muted-foreground">1000+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                      <span className="text-sm">Good</span>
                    </div>
                    <span className="text-xs text-muted-foreground">500-999</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                      <span className="text-sm">Moderate</span>
                    </div>
                    <span className="text-xs text-muted-foreground">200-499</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
                      <span className="text-sm">Low</span>
                    </div>
                    <span className="text-xs text-muted-foreground">&lt;200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Map Area */}
          <div className="lg:col-span-3">
            <Card className="h-[800px]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Enhanced Marine Ecosystem Map
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full p-0 relative">
                {/* Render either Leaflet map or enhanced fallback */}
                {mapInstance === 'fallback' ? (
                  /* Enhanced Fallback Ocean View */
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500 rounded-b-lg overflow-hidden">
                    {/* Enhanced Ocean Background with better gradients */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 via-blue-700/50 to-blue-900/70"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-600/30 to-blue-900/50"></div>
                      
                      {/* Enhanced wave patterns */}
                      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="ocean-waves" patternUnits="userSpaceOnUse" width="120" height="40">
                          <path d="M0 20 Q30 5 60 20 Q90 35 120 20" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none"/>
                          <path d="M0 25 Q40 10 80 25 Q100 35 120 25" stroke="rgba(6,182,212,0.2)" strokeWidth="1.5" fill="none"/>
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#ocean-waves)"/>
                      </svg>
                      
                      {/* Depth contours */}
                      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30%" cy="40%" r="15%" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
                        <circle cx="60%" cy="30%" r="20%" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="1"/>
                        <circle cx="80%" cy="60%" r="25%" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1"/>
                      </svg>
                    </div>

                    {/* Vessel Markers with enhanced styling */}
                    {vesselData.map((vessel, index) => (
                      <div
                        key={vessel.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-all duration-300"
                        style={{
                          left: `${20 + index * 15}%`,
                          top: `${30 + index * 12}%`
                        }}
                        title={vessel.name}
                      >
                        <div className="bg-white p-3 rounded-full shadow-xl border-[3px] border-blue-500 animate-pulse">
                          <Navigation className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                          <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs whitespace-nowrap shadow-lg">
                            {vessel.name}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Enhanced Species Population Markers */}
                    {getFilteredSpeciesData().map((species, index) => {
                      const positions = [
                        { left: '25%', top: '35%' },
                        { left: '45%', top: '55%' },
                        { left: '65%', top: '40%' },
                        { left: '35%', top: '70%' },
                        { left: '55%', top: '25%' },
                        { left: '75%', top: '60%' },
                        { left: '30%', top: '50%' },
                        { left: '60%', top: '75%' },
                        { left: '80%', top: '35%' },
                        { left: '40%', top: '80%' }
                      ];
                      const position = positions[index % positions.length];
                      
                      return (
                        <div
                          key={species.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 transition-all duration-300"
                          style={position}
                          onClick={() => setSelectedSpeciesInfo(species)}
                        >
                          <div className={`w-12 h-12 rounded-full shadow-2xl border-4 border-white ${getPopulationColor(species.populationLevel)} flex items-center justify-center animate-pulse`}>
                            <div className="w-6 h-6 bg-white rounded-full opacity-90 flex items-center justify-center">
                              <Fish className="w-3 h-3 text-blue-600" />
                            </div>
                          </div>
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <Badge variant="secondary" className="text-xs bg-white/95 text-gray-800 shadow-lg">
                              {species.abundance}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}

                    {/* Enhanced map notice */}
                    <div className="absolute top-4 left-4 bg-blue-100/90 backdrop-blur-sm border border-blue-400 text-blue-800 px-4 py-3 rounded-lg text-sm shadow-lg">
                      <div className="flex items-center space-x-2">
                        <Waves className="w-4 h-4" />
                        <span>Enhanced Ocean View - Interactive Mode</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Enhanced Leaflet Map Container */
                  <div
                    ref={mapRef}
                    className="w-full h-full rounded-b-lg"
                    style={{ minHeight: '700px' }}
                    tabIndex={-1}
                  />
                )}

                {/* Custom Map Controls Overlay - Only show for real map */}
                {mapInstance && mapInstance !== 'fallback' && (
                  <div className="absolute top-4 right-4 z-[1000] space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/90 hover:bg-white shadow-lg"
                      onClick={centerOnIndia}
                      title="Center on Indian Ocean"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/90 hover:bg-white shadow-lg"
                      onClick={zoomIn}
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/90 hover:bg-white shadow-lg"
                      onClick={zoomOut}
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Enhanced Legend */}
                <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-200">
                  <h4 className="font-semibold text-sm mb-3 text-gray-800">Map Legend</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                      <span className="text-gray-700">Research Vessels</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-700">Excellent Population</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-cyan-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-700">Good Population</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-700">Moderate Population</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-rose-500 rounded-full shadow-sm"></div>
                      <span className="text-gray-700">Low Population</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Species Information Overlay Panel */}
                {selectedSpeciesInfo && (
                  <div className="absolute top-4 left-4 z-[1000] bg-gray-900/95 backdrop-blur-sm text-white rounded-xl shadow-2xl border border-gray-700 p-5 max-w-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-cyan-400">{selectedSpeciesInfo.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedSpeciesInfo(null)}
                        className="h-6 w-6 p-0 text-white hover:bg-gray-800 rounded-full"
                      >
                        ×
                      </Button>
                    </div>
                    <p className="text-sm text-gray-300 italic mb-3">{selectedSpeciesInfo.scientific}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Fish className="w-4 h-4 text-cyan-400" />
                        <span>Abundance: <span className="text-cyan-400 font-medium">{selectedSpeciesInfo.abundance}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <span>Temp: <span className="text-orange-400 font-medium">{selectedSpeciesInfo.temperature}°C</span></span>
                      </div>
                      <div>pH: <span className="text-green-400 font-medium">{selectedSpeciesInfo.ph}</span></div>
                      <div>Salinity: <span className="text-blue-400 font-medium">{selectedSpeciesInfo.salinity} PSU</span></div>
                      <div>Depth: <span className="text-purple-400 font-medium">{selectedSpeciesInfo.depth}m</span></div>
                      <div>Biomass: <span className="text-yellow-400 font-medium">{selectedSpeciesInfo.biomass} t/km²</span></div>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-3">
                      <strong>Location:</strong> {selectedSpeciesInfo.location}
                    </div>
                    
                    <Badge 
                      variant={getPopulationBadgeVariant(selectedSpeciesInfo.populationLevel)}
                      className="text-xs"
                    >
                      {selectedSpeciesInfo.populationLevel.charAt(0).toUpperCase() + selectedSpeciesInfo.populationLevel.slice(1)} Population
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}