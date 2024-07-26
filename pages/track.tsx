import { useEffect, useState } from 'react';
import Head from 'next/head';
import 'css/bootstrap.min.css';
import styles from '../styles/Track.module.css'; // Update this path according to your project structure

interface Courier {
  code: string;
  description: string;
}

export default function Track() {
  const [awb, setAwb] = useState('');
  const [courier, setCourier] = useState<string>('jne');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch couriers list when component mounts
    const fetchCouriers = async () => {
      try {
        const response = await fetch('/api/list_couriers');
        const data = await response.json();
        if (data) {
          setCouriers(data);
        } else {
          setError('Failed to load couriers.');
        }
      } catch (err) {
        setError('An error occurred while fetching the couriers.');
      }
    };

    fetchCouriers();
  }, []);

  const handleTrack = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/track?awb=${awb}&courier=${courier}`);
      const data = await response.json();
      if (data.status === 200) {
        setTrackingData(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while fetching the tracking data.');
    }
  };

  return (
    <>
      <Head>
        <title>Cek Resi - Rudy Candra</title>
        <meta name="description" content="Track your shipment using the AWB number." />
      </Head>
      <main className="container my-5">
        <h1 className="text-center mb-4">Cek Resi</h1>

        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <label htmlFor="courier" className="form-label">Ekspedisi:</label>
            <div className="dropdown">
              <button
                className="btn btn-outline-primary dropdown-toggle w-100 d-flex justify-content-between align-items-center"
                type="button"
                id="courierDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {couriers.find(c => c.code === courier)?.description || 'Select Courier'}
              </button>
              <ul className="dropdown-menu w-100" aria-labelledby="courierDropdown">
                {couriers.map(c => (
                  <li key={c.code}>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => setCourier(c.code)}
                    >
                      {c.description}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="awb" className="form-label">Nomor Resi :</label>
            <input
              type="text"
              id="awb"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Ketik Nomor Resi"
              className="form-control shadow-sm"
            />
          </div>
        </div>

        <button onClick={handleTrack} className="btn btn-primary w-100 shadow-sm">Track</button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {trackingData && (
          <div className="mt-5">
            <h2 className="mb-4">Informasi Paket</h2>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Status</h5>
                    <p className="card-text">{trackingData.summary.status}</p>
                    <div className="fs-3 text-success">&#x2714;</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Shipper</h5>
                    <p className="card-text">{trackingData.detail.shipper}</p>
                    <div className="fs-3 text-primary">&#x1F69A;</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Receiver</h5>
                    <p className="card-text">{trackingData.detail.receiver}</p>
                    <div className="fs-3 text-warning">&#x1F4E6;</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Origin</h5>
                    <p className="card-text">{trackingData.detail.origin}</p>
                    <div className="fs-3 text-info">&#x1F4CD;</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Destination</h5>
                    <p className="card-text">{trackingData.detail.destination}</p>
                    <div className="fs-3 text-info">&#x1F4CD;</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Date</h5>
                    <p className="card-text">{trackingData.summary.date}</p>
                    <div className="fs-3 text-secondary">&#x1F4C5;</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Description</h5>
                    <p className="card-text">{trackingData.summary.desc}</p>
                    <div className="fs-3 text-warning">&#x1F4E6;</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-5 mb-3">History</h3>
            <div className="list-group">
              {trackingData.history.map((event: any, index: number) => (
                <div key={index} className="list-group-item d-flex justify-content-between align-items-start rounded-pill bg-light shadow-sm mb-2">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{event.desc}</div>
                    <small className="text-muted">{event.date}</small>
                  </div>
                  <span className="badge bg-primary rounded-pill">Update</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"></script>
    </>
  );
}
