import { useNavigate } from 'react-router-dom';

export default function MenuCard({ item }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleViewDetails = () => {
    navigate(`/item/${item.id}`);
  };

  const handleOrder = () => {
    if (!user.id) {
      navigate('/login');
      return;
    }
    handleViewDetails();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-32 bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-6xl cursor-pointer hover:from-orange-400 hover:to-orange-500" onClick={handleViewDetails}>
        {item.image}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 cursor-pointer hover:text-orange-600" onClick={handleViewDetails}>
          {item.name}
        </h3>
        
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {item.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">
            ₹{item.price}
          </div>
          <button
            onClick={handleOrder}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 active:scale-95 transform"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
