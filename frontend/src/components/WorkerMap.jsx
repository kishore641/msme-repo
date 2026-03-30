import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Star, Clock, Zap } from 'lucide-react';

// Fix for default marker icon in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom indicator for Enterprise location
const enterpriseIcon = L.divIcon({
  html: `<div class="w-8 h-8 bg-violet-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to recenter map when workers or enterprise change
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function WorkerMap({ workers, enterprise, onChat, onHire }) {
  const defaultCenter = [28.6139, 77.2090]; // Delhi
  const center = enterprise?.latitude ? [enterprise.latitude, enterprise.longitude] : defaultCenter;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(1);
  };

  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-xl border border-violet-100 overflow-hidden h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-violet-600" />
          Nearby Workers
        </h2>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Availability
          </span>
        </div>
      </div>

      <div className="flex-1 relative rounded-2xl overflow-hidden border border-gray-100">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <RecenterMap center={center} />

          {/* Enterprise Marker */}
          {enterprise?.latitude && (
            <Marker position={[enterprise.latitude, enterprise.longitude]} icon={enterpriseIcon}>
              <Popup>
                <div className="p-1 font-bold">Your Location</div>
              </Popup>
            </Marker>
          )}

          {/* Worker Markers */}
          {workers.filter(w => w.latitude).map(worker => {
            const distance = calculateDistance(enterprise?.latitude, enterprise?.longitude, worker.latitude, worker.longitude);
            const travelTime = distance ? Math.round(distance * 3) : null; // Hack: 3 mins per km

            return (
              <Marker key={worker.id} position={[worker.latitude, worker.longitude]}>
                <Popup className="custom-popup">
                  <div className="w-64 p-2">
                    <div className="flex gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-lg overflow-hidden shrink-0">
                        {worker.work_photos ? (
                            <img src={worker.work_photos} alt="" className="w-full h-full object-cover" />
                        ) : (
                            worker.user?.first_name?.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-gray-900 truncate">
                          {worker.user?.first_name} {worker.user?.last_name}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-500" /> {worker.rating}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                        <div className="text-[10px] text-gray-400 font-medium">Distance</div>
                        <div className="text-xs font-bold text-gray-900">{distance ? `${distance} km` : '--'}</div>
                      </div>
                      <div className="bg-indigo-50 rounded-xl p-2 text-center border border-indigo-100">
                        <div className="text-[10px] text-indigo-400 font-medium">Travel Time</div>
                        <div className="text-xs font-bold text-indigo-700 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" /> {travelTime ? `${travelTime} min` : '--'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${worker.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                            {worker.is_available ? 'AVAILABLE' : 'BUSY'}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">₹{worker.expected_wage}/day</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => onChat(worker)}
                        className="py-2 rounded-xl text-xs font-bold bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors">
                        Chat
                      </button>
                      <button 
                        onClick={() => onHire(worker)}
                        className="py-2 rounded-xl text-xs font-bold bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700 transition-colors">
                        Hire Now
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
