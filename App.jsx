import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import AddressBook from './src/screens/AddressBook/AddressBook';
import ChatScreen from './src/screens/Chat/ChatScreen';
import Dashboard from './src/screens/Dashboard/Dashboard';
import GenerateInvoice from './src/screens/Invoice/GenerateInvoice';
import Invoice from './src/screens/Invoice/Invoice';
import LocationAccess from './src/screens/LocationAccess/LocationAccess';
import MapScreen from './src/screens/Map/MapScreen';
import AddNewAddress from './src/screens/NewAddress/NewAddress';
import Offer from './src/screens/Offer/Offer';
import OrderHistory from './src/screens/OrderHistory/OrderHistory';
import PaymentSuccessAgentScreen from './src/screens/PaymentSuccess/PaymentSuccessAgentScreen';
import PaymentSuccessScreen from './src/screens/PaymentSuccess/PaymentSuccessScreen';
import UpgradePlan from './src/screens/UpgradePlan/UpgradePlan';
import { UserProvider } from './src/context/UserContext.js';

function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
