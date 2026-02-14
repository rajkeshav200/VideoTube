export default function StatBox({ title, value }) {
    return (
        <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-300">{title}</p>
            <h2 className="text-xl font-bold">{value}</h2>
        </div>
    )
}