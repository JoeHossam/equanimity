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
import { HeaderSearch } from './components/navbar2.js';
import NotFound from './pages/notFound';
import Footer from './components/Footer';
import PurchaseList from './pages/PurchasesList';
import AdminContact from './pages/admin/AdminContact';
import AdminPayments from './pages/admin/AdminPayments';
import User from './pages/User';
import {
    BrandWhatsapp,
    BrandFacebook,
    BrandInstagram,
    BrandTwitter,
} from 'tabler-icons-react';

const NavLayout = () => {
    return (
        <>
            <HeaderSearch
                links={[
                    { link: '/', label: 'Home' },
                    { link: '/about', label: 'About' },
                    { link: '/insurances', label: 'Insurances' },
                    { link: '/companies', label: 'Comapanies' },
                ]}
            />
            <div
                style={{
                    minHeight: 'calc(100vh - 150px)',
                }}
            >
                <Outlet />
            </div>
            <Footer
                links={[
                    {
                        link: '#',
                        label: <BrandWhatsapp />,
                    },
                    {
                        link: '#',
                        label: <BrandTwitter />,
                    },
                    {
                        link: '#',
                        label: <BrandInstagram />,
                    },
                    {
                        link: '#',
                        label: <BrandFacebook />,
                    },
                ]}
            />
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
                        <Route
                            path="/profile/purchases"
                            element={<PurchaseList />}
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
                    <Route path="*" element={<NotFound />} />
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
                    <Route path="/admin/payments" element={<AdminPayments />} />
                    <Route path="/admin/reviews" element={<AdminReviews />} />
                    <Route path="/admin/contact" element={<AdminContact />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/user/:id" element={<User />} />
                </Route>
                <Route path="/companyadmin/login" element={<CompanyLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
        </Router>
    );
}

export default App;
