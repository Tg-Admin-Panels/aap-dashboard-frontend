
interface SpinnerOverlayProps {
  loading: boolean;
}

const SpinnerOverlay = ({ loading }: SpinnerOverlayProps) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default SpinnerOverlay;
