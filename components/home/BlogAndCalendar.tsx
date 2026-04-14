import BlogPosts from "./BlogPosts";
import EventCalendar from "./EventCalendar";

export default function BlogAndCalendar() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8 items-stretch">
          <BlogPosts />
          <EventCalendar />
        </div>
      </div>
    </section>
  );
}
