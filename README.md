## Documentation

## Project Title - Creating a Table with various functionalities

> Requirements: <br />
> Bootstrap v5.3 (Optional)

### Design Approach
>### Functionality and its Design Approach<br />
>**Dynamic Table Rendering**<br />
>The table is dynamically generated directly from a JSON data file, ensuring that the content is always up-to-date and easily manageable.<br />
>**Edit functionality**<br />
>The edit feature is activated when the user clicks the edit button for a specific row. The entire row becomes editable, highlighted by a light orange background to indicate its editable state.
>**Delete Functionality**<br />
>Upon clicking the delete button, a confirmation modal pops up, asking the user to confirm the deletion of the selected entry.<br />
>**Add New Functionality**<br />
> When the user clicks the "Add New" button, a modal appears with a form. The user fills out the form, and before submission, data validation is performed to ensure all entries are valid.<br />
>**Sort Functionality**<br />
>Users can sort the table by clicking on the column headers. The sorting occurs in ascending order, and an arrow indicator is displayed to show the current sort direction.
>**Traversing through the Rows**<br />
> Users can navigate through the rows using the up and down arrow buttons or the keyboard's up and down keys, enhancing the accessibility of the table.<br />
>**Accessibility**<br />
>The design incorporates various accessibility features, including ARIA labels for buttons and form elements, ensuring that all users can interact with the table effectively.<br />
>**Responsive Design with Media Queries**<br />
>Media queries are utilized to adapt the layout for medium-sized devices and phones, ensuring that the table and its functionalities remain user-friendly and visually appealing across various screen sizes.<br />
>**LightHouse Score**<br />
>The application has been evaluated using Lighthouse, achieving a score of [insert Lighthouse score here]. This score reflects the performance, accessibility, best practices, and SEO aspects of the application, indicating a well-optimized user experience.<br /><br />

>## Why this Design Approach is Effective<br />
>**User-Centric Experience**<br />
>The approach emphasizes user interaction, allowing users to easily edit, delete, or add entries, which enhances overall satisfaction and engagement.<br />
>**Clarity and Feedback**<br />
>Visual cues, such as the highlighted row during editing and confirmation modals for deletions, provide users with immediate feedback, reducing confusion and ensuring that actions are intentional.<br />
>**Efficiency**<br />
>Dynamic rendering from JSON allows for quick updates to the data without needing to reload the entire page, making the application more responsive and efficient.<br />
>**Accessibility**<br />
>By including navigation options and ARIA labels, the design accommodates users with varying abilities, promoting inclusivity and ensuring compliance with accessibility standards.<br />
>**Enhanced Usability**<br />
> Features like sorting and easy navigation make it simple for users to find and manage information quickly, contributing to a streamlined workflow.<br />
>**Responsive Design**<br />
>The use of media queries ensures that the application adapts seamlessly to different devices, providing an optimal viewing experience for users on medium-sized devices and smartphones.


>**Color Palette**<br />
> The colors used are soft light colors belonging to the muted color schemes for the table<br />
> Colors like blue, red which belong to darker shades are basically used to highlight errors and buttons more effectively as they can be spotted quickly to the user's eye.<br />
## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Light Gray or White Smoke | ![#f7f7f7](https://via.placeholder.com/10/f7f7f7?text=+) #f7f7f7 |
| Light Gray | ![#ddd](https://via.placeholder.com/10/ddd?text=+) #ddd |
| Light Blue | ![#add8e6](https://via.placeholder.com/10/add8e6?text=+) #add8e6 |
| Teal Blue | ![#458297](https://via.placeholder.com/10/458297?text=+) #458297 |
| Crimson Red | ![#dc3545](https://via.placeholder.com/10/dc3545?text=+) #dc3545 |
| Light Teal | ![#d1e7dd](https://via.placeholder.com/10/d1e7dd?text=+) #d1e7dd |

>**Font** <br />
> There is no specific font used as the default font is readable and looks good. But the font weights are changed for adding a bit of styling.

>**Buttons and Icons**<br />
>The icons used are from the site [Heroicons.dev](https://heroicons.dev/)<br />
>The buttons are designed using pure css instead of bootstrap css

>**Components Used**<br />
>The components utilized are Modals and Toasts, both of which are part of the Bootstrap framework.<br />
>These components are specifically used to alert the user before any CRUD operation takes place.<br />
>From UX point of view its very important to use alerts and warnings.


>**Designing of Functions**<br />
>The design of the functions involved leveraging various tools, primarily utilizing MDN Web Docs for JavaScript documentation. Additionally, Gen AI resources, particularly Claude.ai, provided valuable insights and support during the development process. Their assistance contributed to optimizing functionality while ensuring that the core design decisions remained driven by personal expertise and creativity.

>## Demo Video<br />
>[![Watch the video](https://img.youtube.com/vi/your-video-id/0.jpg)](https://youtu.be/bUmHuGzOo7I)