import { ClipLoader } from 'react-spinners';

export default function Spinner({ loading }) {
    return (
        <div className='fixed-container'>
            <h2>Loading...</h2>
            <ClipLoader
                color='aquamarine'
                aria-label='Loading Spinner'
                loading={loading}
                size='5rem'
            />
        </div>
    );
}
