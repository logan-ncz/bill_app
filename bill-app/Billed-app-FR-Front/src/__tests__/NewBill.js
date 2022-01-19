import { screen, waitFor } from "@testing-library/dom"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import store from "../__mocks__/store"
import NewBill from "../containers/NewBill.js"
import BillsUI from "../views/BillsUI.js"


describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    // Create a replica of the localStorage object, because we are not in a browser
    Object.defineProperty(window, 'localStorage', {value: localStorageMock});
    // Ok now that we have a localStorage, we can use it to set an user
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    // Set the current window location to the right path/adress. Like : http://127.0.0.1:8080/#employee/bills in the browser
    Object.defineProperty(window, "location", {
      value: {
        hash: ROUTES_PATH["NewBill"],
      },
    });
  });

  describe("When I am on NewBill Page and I select a png file through the file input", () => {
    test("Then the file name should be found in the input", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }
      const contentNewBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      
      const handleChangeFile = jest.fn(contentNewBill.handleChangeFile);

      const uploader = screen.getByTestId('file');

      uploader.addEventListener('change', handleChangeFile)
      
        fireEvent.change(uploader, {
          target: { files: [new File(['image.png'], 'image.png', { type: 'image/png' })] },
        })

      expect(handleChangeFile).toBeCalled();
      expect(uploader.files[0].name).toBe('image.png');
    })
  })

  describe("When I am on NewBill Page and I select a jpg file through the file input", () => {
    test("Then the file name should be found in the input", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }
      const contentNewBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      
      const handleChangeFile = jest.fn(contentNewBill.handleChangeFile);

      const uploader = screen.getByTestId('file');

      uploader.addEventListener('change', handleChangeFile)
      
        fireEvent.change(uploader, {
          target: { files: [new File(['image.jpg'], 'image.jpg', { type: 'image/jpg' })] },
        })

      expect(handleChangeFile).toBeCalled();
      expect(uploader.files[0].name).toBe('image.jpg');
    })
  })

  describe("When I am on NewBill Page and I select a jpeg file through the file input", () => {
    test("Then the file name should be found in the input", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }
      const contentNewBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      
      const handleChangeFile = jest.fn(contentNewBill.handleChangeFile);

      const uploader = screen.getByTestId('file');

      uploader.addEventListener('change', handleChangeFile)
      
        fireEvent.change(uploader, {
          target: { files: [new File(['image.jpeg'], 'image.jpeg', { type: 'image/jpeg' })] },
        })

      expect(handleChangeFile).toBeCalled();
      expect(uploader.files[0].name).toBe('image.jpeg');
    })
  })

  describe("When I am on NewBill Page and I select a pdf file through the file input", () => {
    test("Then an alert appears saying Incorrect format", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }
      const contentNewBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      
      const handleChangeFile = jest.fn(contentNewBill.handleChangeFile);

      const uploader = screen.getByTestId('file');

      uploader.addEventListener('change', handleChangeFile)
      
        fireEvent.change(uploader, {
          target: { files: [new File(['image.pdf'], 'image.pdf', { type: 'image/pdf' })] },
        })

      expect(handleChangeFile).toBeCalled();
      expect(uploader.files[0].name).not.toBe('image.jpg');
      expect(uploader.files[0].name).not.toBe('image.jpeg');
      expect(uploader.files[0].name).not.toBe('image.png');
    })
  })

  describe("When i fill in the form", () => {
    test("Then the function handleSubmit is called", () => {
      // Build DOM new bill
      const html = NewBillUI();
      document.body.innerHTML = html;
      // Instantiate NewBill()
      const store = null;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      // Mock data of new bill
      const dataNewBill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl:
          "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel",
        commentary: "séminaire billed",
        name: "Hôtel à Paris",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2021-01-04",
        amount: 149,
        commentAdmin: "ok",
        email: JSON.parse(localStorage.getItem("user")).email,
        pct: 20,
      };

      screen.getByTestId("expense-type").value = dataNewBill.type;
      screen.getByTestId("expense-name").value = dataNewBill.name;
      screen.getByTestId("datepicker").value = dataNewBill.date;
      screen.getByTestId("amount").value = dataNewBill.amount;
      screen.getByTestId("vat").value = dataNewBill.vat;
      screen.getByTestId("pct").value = dataNewBill.pct;
      screen.getByTestId("commentary").value = dataNewBill.commentary;
      screen.getByTestId("expense-type").value = dataNewBill.type;
      newBill.fileUrl = dataNewBill.fileUrl;
      newBill.fileName = dataNewBill.fileName;

      const submitFormNewBill = screen.getByTestId("form-new-bill");
      expect(submitFormNewBill).toBeTruthy();

      // Mock function handleSubmit()
      const mockHandleSubmit = jest.fn(newBill.handleSubmit);
      submitFormNewBill.addEventListener("submit", mockHandleSubmit);
      fireEvent.submit(submitFormNewBill);

      expect(mockHandleSubmit).toHaveBeenCalled();

      // Mock function updateBill()
      const mockCreateBill = jest.fn(newBill.updateBill);
      submitFormNewBill.addEventListener("submit", mockCreateBill);
      fireEvent.submit(submitFormNewBill);

      expect(mockCreateBill).toHaveBeenCalled();
      // When form new bill is submited, return on bills page
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
      
    })
    
  })
  describe("When i fill in the form with the pct empty", () => {
    test("Then the function handleSubmit is called", () => {
      // Build DOM new bill
      const html = NewBillUI();
      document.body.innerHTML = html;
      // Instantiate NewBill()
      const store = null;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
  
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
  
      // Mock data of new bill
      const dataNewBill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl:
          "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel",
        commentary: "séminaire billed",
        name: "Hôtel à Paris",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2021-01-04",
        amount: 149,
        commentAdmin: "ok",
        email: JSON.parse(localStorage.getItem("user")).email,
        pct: "",
      };
  
      screen.getByTestId("expense-type").value = dataNewBill.type;
      screen.getByTestId("expense-name").value = dataNewBill.name;
      screen.getByTestId("datepicker").value = dataNewBill.date;
      screen.getByTestId("amount").value = dataNewBill.amount;
      screen.getByTestId("vat").value = dataNewBill.vat;
      screen.getByTestId("pct").value = dataNewBill.pct;
      screen.getByTestId("commentary").value = dataNewBill.commentary;
      screen.getByTestId("expense-type").value = dataNewBill.type;
      newBill.fileUrl = dataNewBill.fileUrl;
      newBill.fileName = dataNewBill.fileName;
  
      const submitFormNewBill = screen.getByTestId("form-new-bill");
      expect(submitFormNewBill).toBeTruthy();
  
      // Mock function handleSubmit()
      const mockHandleSubmit = jest.fn(newBill.handleSubmit);
      submitFormNewBill.addEventListener("submit", mockHandleSubmit);
      fireEvent.submit(submitFormNewBill);
  
      expect(mockHandleSubmit).toHaveBeenCalled();
  
      // Mock function updateBill()
      const mockCreateBill = jest.fn(newBill.updateBill);
      submitFormNewBill.addEventListener("submit", mockCreateBill);
      fireEvent.submit(submitFormNewBill);
  
      expect(mockCreateBill).toHaveBeenCalled();
      // When form new bill is submited, return on bills page
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    })
  })
  

})
// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I post a NewBill", () => {
    test("Then posting the NewBill from mock API POST", async () => {
      const getSpy = jest.spyOn(store, "post")
      const bills = await store.post()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data).toBeTruthy()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})