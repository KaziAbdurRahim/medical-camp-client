import { Link } from 'react-router';

const Page404 = () => {
    return (
        <div className='min-h-screen flex justify-center items-center flex-col relative'>
            <img className='' src="https://img.freepik.com/premium-vector/404-page-found-error-drawing-icon-internet-connection-page-template-doodle-vector-illustration_613530-18.jpg?w=1060" alt="" />
            <div className='btn absolute top-1/2 w-44'>
            <Link to="/"><h2 className='text-3xl'>Go Back</h2></Link>
            </div>
        </div>
    );
};

export default Page404;