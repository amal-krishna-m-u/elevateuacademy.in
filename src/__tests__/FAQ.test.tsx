import { render, screen, fireEvent } from '@testing-library/react';
import { FAQSection } from '../components/sections/FAQ';

const MOCK_FAQS = [
    { sys: { id: '1' }, order: 1, question: "Question 1?", answer: "Answer 1" },
    { sys: { id: '2' }, order: 2, question: "Question 2?", answer: "Answer 2" },
];

describe('FAQSection', () => {
    it('renders all questions', () => {
        render(<FAQSection faqs={MOCK_FAQS} />);
        expect(screen.getByText('Question 1?')).toBeInTheDocument();
        expect(screen.getByText('Question 2?')).toBeInTheDocument();
    });

    it('toggles answer visibility on click', () => {
        render(<FAQSection faqs={MOCK_FAQS} />);

        const question1 = screen.getByText('Question 1?');
        const button1 = question1.closest('button');

        // Initial state: First item open by default (index 0)
        expect(button1).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('Answer 1')).toBeVisible();

        // Click to close
        fireEvent.click(button1!);
        expect(button1).toHaveAttribute('aria-expanded', 'false');

        // Check immediate parent which has the max-h transition classes
        const answerContainer = screen.getByText('Answer 1').parentElement;
        expect(answerContainer).toHaveClass('max-h-0');

        // Click second item
        const question2 = screen.getByText('Question 2?');
        fireEvent.click(question2.closest('button')!);

        const answerContainer2 = screen.getByText('Answer 2').parentElement;
        expect(answerContainer2).toHaveClass('max-h-48');
    });
});
