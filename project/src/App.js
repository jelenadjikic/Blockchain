import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Container } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Header from './components/Header';
import Home from './components/Home';
import AddNewPurchase from './components/AddNewPurchase';
import ActiveSales from './components/ActiveSales/ActiveSales';
import MyPurchases from './components/MyPurchases/MyPurchases';
import MySales from './components/MySales/MySales';
import Sellers from './components/Sellers and ratings/Sellers';
import SoldItems from './components/SoldItems/SoldItems';

function App() {
    return (
      <>
        <Router>
          <Header />
          <Container  maxWidth="md" >
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/addNewPurchase' element={<AddNewPurchase />} />
                <Route path='/activeSales' element={<ActiveSales />} />
                <Route path='/myPurchases' element={<MyPurchases />} />
                <Route path='/mySales' element={<MySales />} />
                <Route path='/sellers' element={<Sellers />} />
                <Route path='/soldItems' element={<SoldItems />} />
              </Routes>
          </Container>
        </Router>

        <ToastContainer/>
      </>
    );
  }
  
  export default App;