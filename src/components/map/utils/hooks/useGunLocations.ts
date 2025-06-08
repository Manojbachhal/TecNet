
import { GunLocation } from '../../types';

export const useGunLocations = () => {
  const gunLocations: GunLocation[] = [
    { id: '1', name: "Shoot Straight", type: "range", position: { lat: 28.6022, lng: -81.3913 }, city: "Orlando, FL", address: "1349 S Orange Blossom Trail" },
    { id: '2', name: "Bass Pro Shops", type: "shop", position: { lat: 28.4125, lng: -81.4347 }, city: "Orlando, FL", address: "5156 International Dr" },
    { id: '3', name: "Shooters World", type: "range", position: { lat: 28.0293, lng: -82.4060 }, city: "Tampa, FL", address: "116 E Fletcher Ave" },
    { id: '4', name: "The Armories", type: "shop", position: { lat: 26.1195, lng: -80.1646 }, city: "Pompano Beach, FL", address: "1035 S Cypress Rd" },
    { id: '5', name: "Nexus Shooting Range", type: "range", position: { lat: 25.9127, lng: -80.3045 }, city: "Miami, FL", address: "13750 NW 107th Ave" },
    { id: '6', name: "Gun World of South Florida", type: "shop", position: { lat: 26.2321, lng: -80.2635 }, city: "Deerfield Beach, FL", address: "1700 S Powerline Rd" },
    { id: '7', name: "Accurate Edge Gunsmithing", type: "gunsmith", position: { lat: 27.9712, lng: -82.4214 }, city: "Tampa, FL", address: "5405 N Nebraska Ave" },
    { id: '8', name: "Gun Site Range", type: "range", position: { lat: 26.6984, lng: -80.0827 }, city: "West Palm Beach, FL", address: "1016 Clare Ave" },
    { id: '9', name: "Ares Firearms Training", type: "training", position: { lat: 28.5590, lng: -81.2960 }, city: "Orlando, FL", address: "8730 E Colonial Dr" },
    { id: '10', name: "Florida Gun Exchange", type: "shop", position: { lat: 29.1960, lng: -81.0436 }, city: "Daytona Beach, FL", address: "1050 S Nova Rd" },
    { id: '11', name: "Delray Shooting Center", type: "range", position: { lat: 26.4608, lng: -80.0987 }, city: "Delray Beach, FL", address: "1505 Poinsettia Dr" },
    { id: '12', name: "Rangemaster Gun Shop", type: "shop", position: { lat: 25.7674, lng: -80.3188 }, city: "Miami, FL", address: "10601 SW 72nd St" },
    { id: '13', name: "Pinellas Firearms", type: "shop", position: { lat: 27.8965, lng: -82.7831 }, city: "Clearwater, FL", address: "1556 S Myrtle Ave" },
    { id: '14', name: "Palmetto Clay Sport", type: "clay", position: { lat: 27.5253, lng: -82.5136 }, city: "Sarasota, FL", address: "7055 Fruitville Rd" }
  ];
  
  return gunLocations;
};
