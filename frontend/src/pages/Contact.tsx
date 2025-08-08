export const Contact = () => {
    return (
        <div className="flex-1 max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-zinc-700 mb-4">
                If you have any questions or feedback, feel free to reach out to us at{" "}
                <a href="mailto:test@test.com" className="text-blue-500 hover:underline">
                    test@test.com
                </a>.
            </p>
            <p className="text-zinc-700">
                You can also follow us on our social media channels for updates and news.
            </p>
        </div>

    );
}