import { useMemo, useState } from 'react';

const initialCars = [
  {
    id: crypto.randomUUID(),
    name: 'Model S',
    manufacturer: 'Tesla',
    year: 2022,
    engineVolume: 0,
    price: 87000,
    color: 'Білий',
    description: 'Електричний седан із великим запасом ходу.',
  },
  {
    id: crypto.randomUUID(),
    name: 'Corolla',
    manufacturer: 'Toyota',
    year: 2021,
    engineVolume: 1.8,
    price: 23000,
    color: 'Сірий',
    description: 'Надійний сімейний автомобіль для міста.',
  },
  {
    id: crypto.randomUUID(),
    name: 'X5',
    manufacturer: 'BMW',
    year: 2020,
    engineVolume: 3,
    price: 62000,
    color: 'Чорний',
    description: 'Преміальний кросовер із потужним двигуном.',
  },
];

const emptyForm = {
  name: '',
  manufacturer: '',
  year: '',
  engineVolume: '',
  price: '',
  color: '',
  description: '',
};

function App() {
  const [cars, setCars] = useState(initialCars);
  const [selectedCarId, setSelectedCarId] = useState(initialCars[0]?.id ?? null);
  const [editingCarId, setEditingCarId] = useState(null);

  const [filters, setFilters] = useState({
    manufacturer: '',
    year: '',
    color: '',
    engineVolume: '',
    minPrice: '',
    maxPrice: '',
  });

  const [formData, setFormData] = useState(emptyForm);

  const selectedCar = cars.find((car) => car.id === selectedCarId) ?? null;

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const manufacturerMatch = filters.manufacturer
        ? car.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase())
        : true;
      const yearMatch = filters.year ? car.year === Number(filters.year) : true;
      const colorMatch = filters.color ? car.color.toLowerCase().includes(filters.color.toLowerCase()) : true;
      const engineMatch = filters.engineVolume
        ? car.engineVolume === Number(filters.engineVolume)
        : true;
      const minPriceMatch = filters.minPrice ? car.price >= Number(filters.minPrice) : true;
      const maxPriceMatch = filters.maxPrice ? car.price <= Number(filters.maxPrice) : true;

      return manufacturerMatch && yearMatch && colorMatch && engineMatch && minPriceMatch && maxPriceMatch;
    });
  }, [cars, filters]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingCarId(null);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedCar = {
      id: editingCarId ?? crypto.randomUUID(),
      name: formData.name.trim(),
      manufacturer: formData.manufacturer.trim(),
      year: Number(formData.year),
      engineVolume: Number(formData.engineVolume),
      price: Number(formData.price),
      color: formData.color.trim(),
      description: formData.description.trim(),
    };

    if (
      !normalizedCar.name ||
      !normalizedCar.manufacturer ||
      !normalizedCar.year ||
      Number.isNaN(normalizedCar.engineVolume) ||
      !normalizedCar.price ||
      !normalizedCar.color
    ) {
      return;
    }

    if (editingCarId) {
      setCars((prev) => prev.map((car) => (car.id === editingCarId ? normalizedCar : car)));
      setSelectedCarId(editingCarId);
    } else {
      setCars((prev) => [normalizedCar, ...prev]);
      setSelectedCarId(normalizedCar.id);
    }

    resetForm();
  };

  const startEdit = (car) => {
    setEditingCarId(car.id);
    setFormData({
      name: car.name,
      manufacturer: car.manufacturer,
      year: String(car.year),
      engineVolume: String(car.engineVolume),
      price: String(car.price),
      color: car.color,
      description: car.description,
    });
  };

  const handleDelete = (id) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
    if (selectedCarId === id) {
      const newSelected = cars.find((car) => car.id !== id);
      setSelectedCarId(newSelected?.id ?? null);
    }
    if (editingCarId === id) {
      resetForm();
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Автомобільний каталог</h1>
        <p>Мінімалістичний React-проєкт для перегляду, фільтрації та керування автомобілями.</p>
      </header>

      <section className="panel filters">
        <h2>Фільтри</h2>
        <div className="grid">
          <input name="manufacturer" placeholder="Виробник" value={filters.manufacturer} onChange={handleFilterChange} />
          <input name="year" placeholder="Рік" type="number" value={filters.year} onChange={handleFilterChange} />
          <input name="color" placeholder="Колір" value={filters.color} onChange={handleFilterChange} />
          <input
            name="engineVolume"
            placeholder="Об'єм (л)"
            type="number"
            step="0.1"
            value={filters.engineVolume}
            onChange={handleFilterChange}
          />
          <input
            name="minPrice"
            placeholder="Ціна від"
            type="number"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            name="maxPrice"
            placeholder="Ціна до"
            type="number"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </div>
      </section>

      <main className="layout">
        <section className="panel list">
          <h2>Список автомобілів ({filteredCars.length})</h2>
          {filteredCars.length === 0 ? (
            <p>За вибраними параметрами автомобілі не знайдено.</p>
          ) : (
            <ul>
              {filteredCars.map((car) => (
                <li key={car.id} className={car.id === selectedCarId ? 'active' : ''}>
                  <button type="button" onClick={() => setSelectedCarId(car.id)}>
                    <span>
                      {car.manufacturer} {car.name}
                    </span>
                    <small>{car.year} • ${car.price.toLocaleString('en-US')}</small>
                  </button>
                  <div className="actions">
                    <button type="button" onClick={() => startEdit(car)}>
                      Редагувати
                    </button>
                    <button type="button" className="danger" onClick={() => handleDelete(car.id)}>
                      Видалити
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel details">
          <h2>Інформація про автомобіль</h2>
          {selectedCar ? (
            <article>
              <h3>
                {selectedCar.manufacturer} {selectedCar.name}
              </h3>
              <p>Рік: {selectedCar.year}</p>
              <p>Колір: {selectedCar.color}</p>
              <p>Об'єм: {selectedCar.engineVolume} л</p>
              <p>Ціна: ${selectedCar.price.toLocaleString('en-US')}</p>
              <p>{selectedCar.description}</p>
            </article>
          ) : (
            <p>Оберіть автомобіль для перегляду деталей.</p>
          )}
        </section>
      </main>

      <section className="panel form">
        <h2>{editingCarId ? 'Редагувати автомобіль' : 'Додати автомобіль'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <input name="name" placeholder="Назва" value={formData.name} onChange={handleFormChange} required />
            <input
              name="manufacturer"
              placeholder="Виробник"
              value={formData.manufacturer}
              onChange={handleFormChange}
              required
            />
            <input name="year" placeholder="Рік випуску" type="number" value={formData.year} onChange={handleFormChange} required />
            <input
              name="engineVolume"
              placeholder="Об'єм"
              step="0.1"
              type="number"
              value={formData.engineVolume}
              onChange={handleFormChange}
              required
            />
            <input name="price" placeholder="Ціна" type="number" value={formData.price} onChange={handleFormChange} required />
            <input name="color" placeholder="Колір" value={formData.color} onChange={handleFormChange} required />
          </div>
          <textarea
            name="description"
            placeholder="Опис"
            value={formData.description}
            onChange={handleFormChange}
            rows={4}
          />
          <div className="actions">
            <button type="submit">{editingCarId ? 'Оновити' : 'Додати'}</button>
            {editingCarId && (
              <button type="button" onClick={resetForm}>
                Скасувати
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

export default App;
