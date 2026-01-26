export default function TestPage() {
    return (
        <div className="container mx-auto p-8 space-y-6">
            <h1 className="text-4xl font-bold text-gradient">CSS Test Page</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                    <h2 className="text-xl font-semibold mb-2">Card Test</h2>
                    <p className="text-gray-400">This is a test card. If you see proper styling, CSS is working!</p>
                </div>

                <div className="card-gradient">
                    <h2 className="text-xl font-semibold mb-2">Gradient Card</h2>
                    <p className="text-gray-400">This card should have a gradient background.</p>
                </div>
            </div>

            <div className="space-x-4">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
            </div>

            <div className="card bg-blue-600/10 border-blue-500/30">
                <h3 className="font-bold mb-2">Tailwind Classes Test</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Background gradient: {typeof document !== 'undefined' ? '✓' : '...'}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Custom components: Cards, Buttons</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Tailwind utilities: Spacing, Colors, Typography</span>
                    </li>
                </ul>
            </div>

            <div className="code-block">
                <code className="text-green-400">
          // Test code block styling{'\n'}
                    console.log("If this is styled, everything works!");
                </code>
            </div>
        </div>
    );
}
