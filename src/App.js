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
import Join from './pages/Join';
import UserProfile from './pages/UserProfile';
import ProfileReviews from './pages/ProfileReviews';
import ProfileSettings from './components/ProfileSettings';
import FavouritesList from './pages/FavouritesList';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyLogin from './pages/company/CompanyLogin';

const NavLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

const ProfileLayout = () => {
    return (
        <>
            <UserProfile />
            <Outlet />
        </>
    );
};

const CompanyNavLayout = () => {
    return (
        <>
            <Outlet />
        </>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<NavLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/about" element={<About />} />

                    <Route path="/profile" element={<ProfileLayout />}>
                        <Route
                            path="/profile/settings"
                            element={<ProfileSettings />}
                        />
                        <Route
                            path="/profile/Favourites"
                            element={<FavouritesList />}
                        />
                        <Route
                            path="/profile/Reviews"
                            element={<ProfileReviews />}
                        />
                    </Route>

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
                <Route path="/join" element={<Join />} />
                <Route path="/companyadmin" element={<CompanyNavLayout />}>
                    <Route index element={<CompanyDashboard />} />
                    <Route
                        path="/companyadmin/login"
                        element={<CompanyLogin />}
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
