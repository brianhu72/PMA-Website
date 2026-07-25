import type { Production } from "../../types";
import {useState} from "react";

interface ProductionSliderProps {
  productions: Production[];
}

export default function ProductionSlider({ productions }: ProductionSliderProps) {
    const byYear = productions.reduce((obj, p) => {
    if (!obj[p.year]) obj[p.year] = [];
    obj[p.year].push(p);
    return obj;
    }, {} as Record<number, Production[]>);

    const years = Object.keys(byYear).map(Number);
    const [selectedYear, setSelectedYear] = useState(years[0]);

  return (<div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', height: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.12)' }} />
              {years.map(year => (
                <button
                key={year}
                onClick={() => setSelectedYear(year)}
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: year === selectedYear ? 'var(--color-red)' : 'rgba(255,255,255,0.3)',
                    position: 'relative',
                    zIndex: 1,
                }}
                />
            ))}
      </div>
       <div style={{ marginTop: 24 }}>
      {byYear[selectedYear].map((p, i) => (
        <p key={i} style={{ color: 'var(--color-light)', fontSize: 13, marginBottom: 6 }}>
          {p.title}
        </p>
      ))}
    </div>


  </div>);
}