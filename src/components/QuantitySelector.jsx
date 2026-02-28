export default function QuantitySelector({ value, onChange, min = 1, max = 99, disabled = false, size = 'md' }) {
    const sizes = {
        sm: { btn: 'w-7 h-7 text-sm', display: 'w-8 text-sm', gap: 'gap-1' },
        md: { btn: 'w-9 h-9 text-base', display: 'w-10 text-base', gap: 'gap-1.5' },
        lg: { btn: 'w-11 h-11 text-lg', display: 'w-12 text-lg', gap: 'gap-2' },
    };

    const s = sizes[size] || sizes.md;

    return (
        <div className={`flex items-center ${s.gap}`}>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }}
                disabled={disabled || value <= min}
                className={`${s.btn} flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-bold transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700 select-none`}
            >
                −
            </button>

            <span className={`${s.display} text-center font-bold text-gray-800 select-none`}>
                {value}
            </span>

            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
                disabled={disabled || value >= max}
                className={`${s.btn} flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-gray-700 font-bold transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700 select-none`}
            >
                +
            </button>
        </div>
    );
}
