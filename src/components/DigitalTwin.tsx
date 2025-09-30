import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Layout } from './Layout';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart as RechartsBarChart, Bar
} from 'recharts';
import { 
  Play, Square, RotateCcw, Activity, AlertTriangle, TrendingDown, 
  TrendingUp, Thermometer, Waves, TestTube, Wind, Droplets, Zap,
  Fish, Eye, Users, Target
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'researcher' | 'policymaker' | 'conservationist' | 'admin';
}

interface DigitalTwinProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  language: 'en' | 'ml';
}

const initialSpeciesData = [
  {
    name: 'Yellowfin Tuna',
    scientific: 'Thunnus albacares',
    population: 614,
    biomass: 10241,
    change: -48.8,
    color: '#3b82f6',
    icon: Fish,
    tempSensitivity: 0.8,
    oxygenSensitivity: 0.9,
    phSensitivity: 0.6
  },
  {
    name: 'Oil Sardine',
    scientific: 'Sardinella longiceps',
    population: 3482,
    biomass: 7672,
    change: -59.0,
    color: '#10b981',
    icon: Fish,
    tempSensitivity: 0.7,
    oxygenSensitivity: 0.8,
    phSensitivity: 0.5
  },
  {
    name: 'Indian Mackerel',
    scientific: 'Rastrelliger kanagurta',
    population: 2571,
    biomass: 5508,
    change: -58.5,
    color: '#f59e0b',
    icon: Fish,
    tempSensitivity: 0.6,
    oxygenSensitivity: 0.7,
    phSensitivity: 0.4
  },
  {
    name: 'Silver Pomfret',
    scientific: 'Pampus argenteus',
    population: 1846,
    biomass: 5508,
    change: -70.2,
    color: '#06b6d4',
    icon: Fish,
    tempSensitivity: 0.9,
    oxygenSensitivity: 0.8,
    phSensitivity: 0.7
  },
  {
    name: 'Tiger Prawn',
    scientific: 'Penaeus monodon',
    population: 1018,
    biomass: 1697,
    change: -78.8,
    color: '#8b5cf6',
    icon: Fish,
    tempSensitivity: 0.5,
    oxygenSensitivity: 0.6,
    phSensitivity: 0.8
  }
];

// Real-time population history data
const generatePopulationHistory = () => {
  const timePoints = [];
  const currentTime = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(currentTime.getTime() - i * 5 * 60 * 1000); // 5-minute intervals
    timePoints.push({
      time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      'Yellowfin Tuna': Math.max(100, 614 + Math.sin(i * 0.2) * 50 + (Math.random() - 0.5) * 30),
      'Oil Sardine': Math.max(1000, 3482 + Math.cos(i * 0.15) * 200 + (Math.random() - 0.5) * 100),
      'Indian Mackerel': Math.max(800, 2571 + Math.sin(i * 0.25) * 150 + (Math.random() - 0.5) * 80),
      'Silver Pomfret': Math.max(500, 1846 + Math.cos(i * 0.3) * 100 + (Math.random() - 0.5) * 60),
      'Tiger Prawn': Math.max(200, 1018 + Math.sin(i * 0.35) * 80 + (Math.random() - 0.5) * 40),
    });
  }
  
  return timePoints;
};

const ecosystemHistory = [
  { time: '00:00', health: 65, biodiversity: 2.1, fishCount: 12500 },
  { time: '00:30', health: 58, biodiversity: 1.9, fishCount: 11200 },
  { time: '01:00', health: 52, biodiversity: 1.7, fishCount: 10100 },
  { time: '01:30', health: 45, biodiversity: 1.5, fishCount: 9200 },
  { time: '02:00', health: 38, biodiversity: 1.44, fishCount: 8388 },
];

export function DigitalTwin({ user, onNavigate, onLogout, language }: DigitalTwinProps) {
  const [isSimulationActive, setIsSimulationActive] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(2);
  const [timeSteps, setTimeSteps] = useState(127);
  const [autoSimulation, setAutoSimulation] = useState(true);
  
  const [environmentalParams, setEnvironmentalParams] = useState({
    temperature: [26.0],
    salinity: [34.0],
    ph: [8.10],
    oxygen: [6.0],
    turbidity: [3.0],
    nutrients: [40]
  });

  const [ecosystemMetrics, setEcosystemMetrics] = useState({
    health: 35,
    biodiversity: 1.44,
    totalFish: 8388,
    waterTemp: 26.0,
    oxygenLevel: 6.0
  });

  const [speciesData, setSpeciesData] = useState(initialSpeciesData);
  const [populationHistory, setPopulationHistory] = useState(generatePopulationHistory());
  const [selectedSpecies, setSelectedSpecies] = useState('Yellowfin Tuna');

  // Calculate species impact based on environmental parameters
  const calculateSpeciesImpact = (species: any, parameter: string, value: number) => {
    let impact = 0.5; // Neutral impact
    
    switch (parameter) {
      case 'temperature':
        if (value >= 24 && value <= 28) {
          impact = 0.8; // Positive impact
        } else if (value < 22 || value > 30) {
          impact = 0.2; // Negative impact
        } else {
          impact = 0.5; // Neutral
        }
        return impact * species.tempSensitivity;
        
      case 'oxygen':
        if (value >= 6) {
          impact = 0.9;
        } else if (value < 4) {
          impact = 0.1;
        } else {
          impact = 0.4;
        }
        return impact * species.oxygenSensitivity;
        
      case 'ph':
        if (value >= 8.0 && value <= 8.2) {
          impact = 0.8;
        } else if (value < 7.8 || value > 8.4) {
          impact = 0.2;
        } else {
          impact = 0.5;
        }
        return impact * species.phSensitivity;
        
      default:
        return 0.5;
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    if (isSimulationActive && autoSimulation) {
      const interval = setInterval(() => {
        setTimeSteps(prev => prev + 1);
        
        // Update ecosystem metrics
        setEcosystemMetrics(prev => ({
          ...prev,
          health: Math.max(10, prev.health + (Math.random() - 0.7) * 2),
          biodiversity: Math.max(0.5, prev.biodiversity + (Math.random() - 0.6) * 0.1),
          totalFish: Math.max(5000, prev.totalFish + Math.floor((Math.random() - 0.7) * 200)),
          waterTemp: environmentalParams.temperature[0],
          oxygenLevel: environmentalParams.oxygen[0]
        }));

        // Update species population based on environmental parameters
        setSpeciesData(prev => prev.map(species => {
          const tempImpact = calculateSpeciesImpact(species, 'temperature', environmentalParams.temperature[0]);
          const oxygenImpact = calculateSpeciesImpact(species, 'oxygen', environmentalParams.oxygen[0]);
          const phImpact = calculateSpeciesImpact(species, 'ph', environmentalParams.ph[0]);
          
          const totalImpact = (tempImpact + oxygenImpact + phImpact) / 3;
          const populationChange = Math.floor((totalImpact - 0.5) * 20 + (Math.random() - 0.5) * 10);
          
          return {
            ...species,
            population: Math.max(50, species.population + populationChange),
            change: ((populationChange / species.population) * 100).toFixed(1)
          };
        }));

        // Update population history
        setPopulationHistory(prev => {
          const newHistory = [...prev];
          const currentTime = new Date();
          const newDataPoint = {
            time: currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            'Yellowfin Tuna': speciesData[0]?.population || 614,
            'Oil Sardine': speciesData[1]?.population || 3482,
            'Indian Mackerel': speciesData[2]?.population || 2571,
            'Silver Pomfret': speciesData[3]?.population || 1846,
            'Tiger Prawn': speciesData[4]?.population || 1018,
          };
          
          newHistory.shift(); // Remove oldest point
          newHistory.push(newDataPoint); // Add new point
          return newHistory;
        });
      }, 2000 / simulationSpeed);
      return () => clearInterval(interval);
    }
  }, [isSimulationActive, autoSimulation, simulationSpeed, environmentalParams, speciesData]);

  const handleParameterChange = (param: keyof typeof environmentalParams, value: number[]) => {
    setEnvironmentalParams(prev => ({ ...prev, [param]: value }));
    // Update ecosystem based on parameters
    const newHealth = calculateEcosystemHealth(param, value[0]);
    setEcosystemMetrics(prev => ({ ...prev, health: newHealth }));
  };

  const calculateEcosystemHealth = (param: string, value: number) => {
    // Simplified ecosystem health calculation based on optimal ranges
    let healthScore = ecosystemMetrics.health;
    
    switch (param) {
      case 'temperature':
        if (value >= 24 && value <= 28) healthScore += 2;
        else healthScore -= 3;
        break;
      case 'salinity':
        if (value >= 33 && value <= 36) healthScore += 1;
        else healthScore -= 2;
        break;
      case 'ph':
        if (value >= 8.0 && value <= 8.2) healthScore += 2;
        else healthScore -= 4;
        break;
      case 'oxygen':
        if (value >= 6) healthScore += 3;
        else healthScore -= 5;
        break;
    }
    
    return Math.max(10, Math.min(100, healthScore));
  };

  return (
    <Layout user={user} onNavigate={onNavigate} onLogout={onLogout} language={language}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-government-blue">Digital Twin Marine Ecosystem</h1>
            <p className="text-muted-foreground mt-2">Real-time Species Population & Environmental Controls</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="w-4 h-4 mr-2" />
            Live Simulation
          </Badge>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                AI Model Status
                <Badge variant={isSimulationActive ? "default" : "secondary"}>
                  {isSimulationActive ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Button 
                  onClick={() => setIsSimulationActive(true)}
                  variant={isSimulationActive ? "default" : "outline"}
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Simulation
                </Button>
                <Button 
                  onClick={() => setIsSimulationActive(false)}
                  variant="outline"
                  size="sm"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
                <Button 
                  onClick={() => {
                    setTimeSteps(0);
                    setSpeciesData(initialSpeciesData);
                    setPopulationHistory(generatePopulationHistory());
                    setEcosystemMetrics({
                      health: 75,
                      biodiversity: 2.5,
                      totalFish: 15000,
                      waterTemp: 26.0,
                      oxygenLevel: 7.5
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Speed: {simulationSpeed}x</label>
                  <Slider
                    value={[simulationSpeed]}
                    onValueChange={(value) => setSimulationSpeed(value[0])}
                    max={5}
                    min={0.5}
                    step={0.5}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{timeSteps}</div>
              <div className="text-sm text-muted-foreground">Simulation cycles completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Ecosystem Data */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Ecosystem Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{ecosystemMetrics.health}%</div>
                <div className="text-sm text-muted-foreground">Ecosystem Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ecosystemMetrics.biodiversity}</div>
                <div className="text-sm text-muted-foreground">Biodiversity Index</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ecosystemMetrics.totalFish.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Fish</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ecosystemMetrics.waterTemp}°C</div>
                <div className="text-sm text-muted-foreground">Water Temp</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ecosystemMetrics.oxygenLevel} mg/L</div>
                <div className="text-sm text-muted-foreground">Oxygen</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Environmental Controls */}
          <Card className="lg:col-span-1">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Environmental Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center">
                    <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                    Temperature
                  </label>
                  <span className="text-lg font-bold text-red-600">{environmentalParams.temperature[0]}°C</span>
                </div>
                <Slider
                  value={environmentalParams.temperature}
                  onValueChange={(value) => handleParameterChange('temperature', value)}
                  max={32}
                  min={20}
                  step={0.1}
                  className="mb-2"
                />
                <div className="text-xs text-muted-foreground">20°C - 32°C</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center">
                    <Waves className="w-4 h-4 mr-2 text-blue-500" />
                    Salinity
                  </label>
                  <span className="text-lg font-bold text-blue-600">{environmentalParams.salinity[0]} PSU</span>
                </div>
                <Slider
                  value={environmentalParams.salinity}
                  onValueChange={(value) => handleParameterChange('salinity', value)}
                  max={37}
                  min={30}
                  step={0.1}
                  className="mb-2"
                />
                <div className="text-xs text-muted-foreground">30 - 37 PSU</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center">
                    <TestTube className="w-4 h-4 mr-2 text-green-500" />
                    pH Level
                  </label>
                  <span className="text-lg font-bold text-green-600">{environmentalParams.ph[0]}</span>
                </div>
                <Slider
                  value={environmentalParams.ph}
                  onValueChange={(value) => handleParameterChange('ph', value)}
                  max={8.3}
                  min={7.8}
                  step={0.01}
                  className="mb-2"
                />
                <div className="text-xs text-muted-foreground">7.8 - 8.3</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center">
                    <Wind className="w-4 h-4 mr-2 text-cyan-500" />
                    Oxygen
                  </label>
                  <span className="text-lg font-bold text-cyan-600">{environmentalParams.oxygen[0]} mg/L</span>
                </div>
                <Slider
                  value={environmentalParams.oxygen}
                  onValueChange={(value) => handleParameterChange('oxygen', value)}
                  max={8}
                  min={4}
                  step={0.1}
                  className="mb-2"
                />
                <div className="text-xs text-muted-foreground">4 - 8 mg/L</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center">
                    <Eye className="w-4 h-4 mr-2 text-amber-500" />
                    Turbidity
                  </label>
                  <span className="text-lg font-bold text-amber-600">{environmentalParams.turbidity[0]} NTU</span>
                </div>
                <Slider
                  value={environmentalParams.turbidity}
                  onValueChange={(value) => handleParameterChange('turbidity', value)}
                  max={10}
                  min={0}
                  step={0.1}
                  className="mb-2"
                />
                <div className="text-xs text-muted-foreground">0 - 10 NTU</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center">
                    <Droplets className="w-4 h-4 mr-2 text-purple-500" />
                    Nutrients
                  </label>
                  <span className="text-lg font-bold text-purple-600">{environmentalParams.nutrients[0]} µg/L</span>
                </div>
                <Slider
                  value={environmentalParams.nutrients}
                  onValueChange={(value) => handleParameterChange('nutrients', value)}
                  max={100}
                  min={10}
                  step={1}
                  className="mb-2"
                />
                <div className="text-xs text-muted-foreground">10 - 100 µg/L</div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Species Population Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Real-time Species Population
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={populationHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Yellowfin Tuna" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Oil Sardine" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Indian Mackerel" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Silver Pomfret" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Tiger Prawn" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Species Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {speciesData.map((species, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedSpecies === species.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedSpecies(species.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Fish className="w-8 h-8" style={{ color: species.color }} />
                  <Badge 
                    variant={parseFloat(species.change as string) < 0 ? "destructive" : "default"}
                    className="flex items-center"
                  >
                    {parseFloat(species.change as string) < 0 ? (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    )}
                    {species.change}%
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm mb-1">{species.name}</h4>
                <p className="text-xs text-muted-foreground italic mb-2">{species.scientific}</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Population:</span>
                    <span className="text-sm font-bold">{species.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Biomass:</span>
                    <span className="text-sm font-bold">{species.biomass.toLocaleString()} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Generated Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              AI-Generated Real-time Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-red-800">Environmental Impact Alert</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Temperature changes affecting {selectedSpecies} population dynamics
                      </p>
                      <p className="text-sm text-red-600 mt-2 font-medium">
                        Current parameters show {environmentalParams.temperature[0]}°C - outside optimal range
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Real-time</Badge>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <TrendingDown className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Population Trend Analysis</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Species responding to oxygen level changes: {environmentalParams.oxygen[0]} mg/L
                      </p>
                      <p className="text-sm text-orange-600 mt-2 font-medium">
                        Ecosystem health at {ecosystemMetrics.health}% - intervention recommended
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Live Update</Badge>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Simulation Status</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Digital twin running at {simulationSpeed}x speed - {timeSteps} cycles completed
                      </p>
                      <p className="text-sm text-blue-600 mt-2 font-medium">
                        Real-time parameter adjustments affecting population trends
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ecosystem Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Ecosystem Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ecosystemHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="health"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Ecosystem Health (%)"
                />
                <Area
                  type="monotone"
                  dataKey="biodiversity"
                  stackId="2"
                  stroke="#0891b2"
                  fill="#0891b2"
                  fillOpacity={0.6}
                  name="Biodiversity Index"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}