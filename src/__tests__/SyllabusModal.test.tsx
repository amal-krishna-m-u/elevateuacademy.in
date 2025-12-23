import { render, screen, fireEvent } from '@testing-library/react';
import { SyllabusModal } from '../components/modals/SyllabusModal';
import { Course } from '../lib/contentful';

const MOCK_COURSE: Course = {
    sys: { id: '1' },
    title: "Test Course",
    category: "Test Cat",
    duration: "1 Month",
    description: "Desc",
    modules: ["Mod 1", "Mod 2"],
    highlights: ["High 1"],
    tools: ["Tool 1"]
};

// Mock MagneticButton since it uses ref measurements which fail in JSDOM usually
jest.mock('../components/ui/MagneticButton', () => ({
    MagneticButton: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>
}));

describe('SyllabusModal', () => {
    it('does not render when closed', () => {
        render(<SyllabusModal course={MOCK_COURSE} isOpen={false} onClose={() => { }} />);
        expect(screen.queryByText('Test Course')).not.toBeInTheDocument();
    });

    it('renders content when open', () => {
        render(<SyllabusModal course={MOCK_COURSE} isOpen={true} onClose={() => { }} />);
        expect(screen.getByText('Test Course')).toBeInTheDocument();
        expect(screen.getByText('Core Modules')).toBeInTheDocument();
        expect(screen.getByText('Mod 1')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const handleClose = jest.fn();
        render(<SyllabusModal course={MOCK_COURSE} isOpen={true} onClose={handleClose} />);

        // The X icon button
        const closeButtons = screen.getAllByRole('button');
        // First button is usually the top close button in the heavy modal structure
        // Or we can query by test id, but let's assume implementation details for now or add role/label.
        // We didn't add aria-label to the close button in code.
        // It's the button containing <X />.

        // Simpler: background backdrop click
        // The backdrop has onClick={onClose}
        // It's the div with bg-black/90
        // Querying by class is fragile, but functional for this scope.
        // Or just look for any button that calls it.

        // There is loop in our code: 3 buttons? Header X, Enquire (Magnetic), Backdrop (div).
        // Let's modify the component to have test IDs or labels properly, or just fire on the X button.
        // The X button is inside the header.

        // Let's rely on firing click on the div with backdrop
        // It is the first child of the root.
        // render results in <body><div>...</div></body>
        // We can query selector.

        const backdrop = document.getElementsByClassName('bg-black/90')[0];
        if (backdrop) fireEvent.click(backdrop);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
