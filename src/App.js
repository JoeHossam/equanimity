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
import CompanyNav from './pages/company/CompanyNav';
import CompanyProfile from './pages/company/CompanyProfile';
import AdminNav from './pages/admin/AdminNav';
import AdminLogin from './pages/admin/AdminLogin';
import AdminInsurances from './pages/admin/AdminInsurances';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminReviews from './pages/admin/AdminReviews';
import AdminUsers from './pages/admin/AdminUsers';

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
            <CompanyNav />
            <Outlet />
        </>
    );
};

const AdminNavLayout = () => {
    return (
        <>
            <AdminNav />
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
                        path="/companyadmin/profile"
                        element={<CompanyProfile />}
                    />
                </Route>
                <Route path="/admin" element={<AdminNavLayout />}>
                    <Route
                        path="/admin/insurances"
                        element={<AdminInsurances />}
                    />
                    <Route
                        path="/admin/categories"
                        element={<AdminCategories />}
                    />
                    <Route
                        path="/admin/companies"
                        element={<AdminCompanies />}
                    />
                    <Route path="/admin/reviews" element={<AdminReviews />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                </Route>
                <Route path="/companyadmin/login" element={<CompanyLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
        </Router>
    );
}

export default App;
