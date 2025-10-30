export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-20">
      <div className="w-16 h-16 border-4 border-border-color border-t-accent-blue rounded-full animate-spin mb-4" />
      <p className="text-text-secondary">{message}</p>
    </div>
  )
}

