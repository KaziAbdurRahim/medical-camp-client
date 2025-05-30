import CountUp from 'react-countup';
import FoodPic from '../assets/image.png'


const TotalMeals = () => {
    return (

        <div className="card lg:card-side bg-base-100 shadow-xl pb-4 max-w-sm sm:max-w-lg lg:max-w-5xl mx-auto">
            <figure className='h-full w-96 lg:w-[484px] object-cover mx-auto'>
                <img
                    src={FoodPic}
                    // src={'https://img.freepik.com/free-vector/healthy-unhealthy-food_1284-3834.jpg?t=st=1738217622~exp=1738221222~hmac=4db7e2318248f514594a1974e96a67cde75d52a8f8bcaa971e1d2e99894d54d9&w=1060'}
                    alt="Album"
                />
            </figure>

            <div className="card-body">
                <h2 className="card-title justify-center text-4xl lg:mt-20">Total Meals Served</h2>
                <div className='grow flex justify-center items-center lg:mb-20'>
                    <CountUp
                        start={0}
                        end={2613}
                        duration={16}
                        suffix="+"
                        enableScrollSpy={true}
                        scrollSpyDelay={100}
                        scrollSpyOnce={true}
                    >
                        {({ countUpRef }) => (
                            <div className='text-3xl font-bold my-5 btn h-auto px-6 py-2 btn-active'>
                                <span ref={countUpRef} />
                            </div>
                        )}
                    </CountUp>
                </div>
                <div className="card-actions justify-end">
                    <a href="">
                        <button className="btn btn-primary">Discover</button>
                    </a>
                </div>
            </div>
        </div>

    );
};

export default TotalMeals;
