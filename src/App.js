import {
    BrowserRouter as Router,
    Outlet,
    Route,
    Routes,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Insurance from './pages/Insurance';
import Login from './pages/Login';
import InsuranceList from './pages/InsuranceList';
import Company from './pages/Company';
import CompanyList from './pages/CompanyList';
import Error from './pages/Error';

const NavLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<NavLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/insurances" element={<InsuranceList />} />
                    <Route
                        path="/insurances/:category"
                        element={<InsuranceList />}
                    />
                    <Route path="/companies" element={<CompanyList />} />
                    <Route path="/company/:id" element={<Company />} />
                    <Route path="/insurance/:id" element={<Insurance />} />
                    <Route path="*" element={<Error />} />
                </Route>
                <Route path="/join" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
